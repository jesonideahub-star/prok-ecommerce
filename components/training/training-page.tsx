"use client";

import { useEffect, useState } from "react";
import Image from "@/components/media-image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Check,
  Hand,
  Trophy,
  UsersRound,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type TrainingVideo = {
  name: string;
  src: string;
  type: string;
};

type TrainingCourseImages = Record<string, string>;

const trainingBucket = "Barista_Training";
const videoExtensions = /\.(mp4|webm|mov|m4v|ogv)$/i;
const courseImageNames = ["website2.png", "website10.png"];

async function loadTrainingCourseImages(): Promise<TrainingCourseImages> {
  const bucket = createClient().storage.from(trainingBucket);
  const { data, error } = await bucket.list("", {
    limit: 1000,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) throw error;

  return Object.fromEntries(
    courseImageNames.flatMap((imageName) => {
      const image = data?.find(
        (file) =>
          file.id !== null && file.name.toLowerCase() === imageName.toLowerCase()
      );

      if (!image) {
        console.error(
          `Unable to find "${imageName}" in the ${trainingBucket} bucket.`
        );
        return [];
      }

      const publicUrl = bucket.getPublicUrl(image.name).data.publicUrl;
      const cacheVersion = image.updated_at ?? image.created_at;

      return [
        [
          imageName,
          cacheVersion
            ? `${publicUrl}?v=${encodeURIComponent(cacheVersion)}`
            : publicUrl,
        ],
      ];
    })
  );
}

async function loadTrainingVideos(): Promise<TrainingVideo[]> {
  const bucket = createClient().storage.from(trainingBucket);

  async function listDirectory(path: string) {
    const entries = [];
    const limit = 1000;

    for (let offset = 0; ; offset += limit) {
      const { data, error } = await bucket.list(path, {
        limit,
        offset,
        sortBy: { column: "name", order: "asc" },
      });

      if (error) throw error;
      entries.push(...(data ?? []));
      if (!data || data.length < limit) break;
    }

    return entries;
  }

  async function walk(path: string): Promise<TrainingVideo[]> {
    const entries = await listDirectory(path);
    const videos: TrainingVideo[] = [];

    for (const entry of entries) {
      const entryPath = path ? `${path}/${entry.name}` : entry.name;
      if (entry.id === null) {
        videos.push(...(await walk(entryPath)));
        continue;
      }

      if (!videoExtensions.test(entry.name)) continue;

      const publicUrl = bucket.getPublicUrl(entryPath).data.publicUrl;
      const cacheVersion = entry.updated_at ?? entry.created_at;

      videos.push({
        name: entry.name.replace(videoExtensions, "").replace(/[_-]+/g, " ").trim(),
        src: cacheVersion
          ? `${publicUrl}?v=${encodeURIComponent(cacheVersion)}`
          : publicUrl,
        type:
          entry.name.toLowerCase().endsWith(".mp4") ||
          entry.name.toLowerCase().endsWith(".m4v")
            ? "video/mp4"
            : entry.name.toLowerCase().endsWith(".webm")
              ? "video/webm"
              : entry.name.toLowerCase().endsWith(".ogv")
                ? "video/ogg"
                : "video/quicktime",
      });
    }

    return videos;
  }

  return (await walk("")).sort(
    (a, b) =>
      Number(b.type === "video/mp4") - Number(a.type === "video/mp4") ||
      a.name.localeCompare(b.name)
  );
}

const courseHighlights = [
  {
    title: "Barista 101",
    description: "Discussion and Insights",
    imageName: "website2.png",
    fallbackImage: "/images/about-latte.png",
    outcomes: [
      "Coffee History",
      "Introduction to Coffee",
      "Coffee Theory",
      "Specialty Coffee",
      "Cupping & Sensory Skills",
      "Alternative Brewing Method",
      "Cafe Management",
      "Espresso Making",
    ],
    href: "/#contact",
  },
  {
    title: "Barista 102",
    description: "Discussion and Insights",
    imageName: "website10.png",
    fallbackImage: "/images/training-hero.png",
    outcomes: [
      "Milk Steaming & Science Behind It (Latte Art)",
      "Preparation of Drinks",
      "Cafe Management",
      "Exploring Coffee Origins",
      "Espresso Prep",
      "Role of Water Brewing",
      "Machine Calibration",
      "Sensory and Brewing",
    ],
    href: "/#contact",
  },
] as const;

const benefits = [
  { icon: Award, title: "Expert Instructors", description: "Learn from industry professionals." },
  { icon: Hand, title: "Hands-On Training", description: "Get practical experience." },
  { icon: Trophy, title: "Certification", description: "Earn a recognized certificate." },
  { icon: UsersRound, title: "Career Support", description: "Grow your coffee career." },
] as const;

export function TrainingPage() {
  const [videos, setVideos] = useState<TrainingVideo[]>([]);
  const [courseImages, setCourseImages] = useState<TrainingCourseImages>({});
  const [videosError, setVideosError] = useState(false);
  const trainingHeroImage =
    courseImages["website10.png"] ?? "/images/training-hero.png";

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setVideosError(false);
        const trainingVideos = await loadTrainingVideos();
        if (active) setVideos(trainingVideos);
      } catch (error) {
        console.error(`Unable to load training videos from the ${trainingBucket} bucket.`, error);
        if (active) setVideosError(true);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadImages() {
      try {
        const images = await loadTrainingCourseImages();
        if (active) setCourseImages(images);
      } catch (error) {
        console.error(
          `Unable to load training course images from the ${trainingBucket} bucket.`,
          error
        );
      }
    }

    void loadImages();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="flex-1 bg-[#fff7f7] text-[#292226]">
      <section className="relative isolate overflow-hidden border-y border-[#f2b2ba] bg-[linear-gradient(105deg,#fff8f8_0%,#ffe8eb_45%,#f7b7c1_100%)]">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-[120px] -top-[320px] size-[620px] rounded-full border-[26px] border-white/65" />
          <div className="absolute left-[18%] -top-[390px] size-[700px] rounded-full border-[22px] border-[#f19aa8]/25" />
          <div className="absolute right-[-130px] -bottom-[330px] size-[600px] rounded-full border-[28px] border-white/50" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(170deg,transparent 0_43%,rgba(226,24,51,.13) 44%_52%,transparent 53%)]" />
        </div>
        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-6 px-5 py-7 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-8 sm:px-8 sm:py-8 lg:gap-12 lg:px-14">
          <div className="relative z-10 max-w-[520px]">
            <p className="text-[10px] font-bold tracking-[0.14em] text-[#d7182e] uppercase sm:text-[12px]">
              Barista Training
            </p>
            <h1 className="mt-2 font-serif text-[clamp(1.75rem,7vw,3.125rem)] leading-[.98] font-medium text-[#482326] sm:text-[42px] sm:leading-[.94] lg:text-[50px]">
              Professional
              <span className="block whitespace-nowrap font-bold text-[#d7192d] italic">
                Barista Training
              </span>
            </h1>
            <p className="mt-3 max-w-[340px] text-[11px] leading-snug text-[#403739] sm:text-[13px]">
              Enhance your skills. Master the craft.
              <br />
              Serve the perfect cup.
            </p>
            <a
              href="#courses"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#e50925] px-4 py-1.5 text-[10px] font-semibold text-white transition-colors hover:bg-[#bd1024] sm:text-[11px]"
            >
              Explore Our Training Courses
              <ArrowRight className="size-3" />
            </a>
          </div>
          <div className="relative mx-auto aspect-[9/16] max-h-[600px] w-full max-w-[338px] overflow-hidden rounded-xl bg-[#2b2323] shadow-[0_16px_45px_rgba(74,35,38,.22)] sm:mx-0 sm:ml-auto sm:aspect-video sm:h-auto sm:w-full sm:max-w-[800px]">
            {videos[0] ? (
              <video
                autoPlay
                controls
                muted
                playsInline
                preload="metadata"
                width={720}
                height={1280}
                poster={trainingHeroImage}
                aria-label={videos[0].name}
                className="absolute inset-0 size-full object-contain"
              >
                <source src={videos[0].src} type={videos[0].type} />
              </video>
            ) : (
              <Image
                src={trainingHeroImage}
                alt="Barista instructor demonstrating latte art to a training class"
                fill
                preload
                sizes="(min-width: 640px) 60vw, 338px"
                className="object-cover"
              />
            )}
          </div>
        </div>
      </section>

      {videosError ? (
        <p role="alert" className="px-4 pt-2 text-center text-xs text-[#9f1d2c]">
          Training videos could not be loaded. Please try again later.
        </p>
      ) : null}

      <section id="courses" className="px-4 pt-4 pb-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            <h2 className="font-serif text-[22px] leading-tight font-bold text-[#492829] sm:text-[27px]">
              Our Barista Courses
            </h2>
            <span className="hidden h-px flex-1 bg-[#ef8e98] sm:block" />
            <p className="text-[10px] text-[#51484a] sm:text-[11px]">
              Professional training for coffee enthusiasts and business owners.
            </p>
          </div>
          <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-5 sm:grid-cols-2">
            {courseHighlights.map((course) => (
              <article
                key={course.title}
                className="flex min-w-0 flex-col overflow-hidden rounded-[18px] border border-[#f2d6d7] bg-white/75 shadow-[0_3px_12px_rgba(115,38,44,.04)]"
              >
                <div className="relative aspect-[1.5] overflow-hidden bg-[#eee8e4]">
                  <Image
                    src={courseImages[course.imageName] ?? course.fallbackImage}
                    alt={course.title}
                    fill
                    sizes="(min-width: 1120px) 560px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <h3 className="font-serif text-[21px] leading-[1.05] font-bold text-[#432725] sm:text-[26px]">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-snug text-[#5e5553] sm:text-[16px]">
                    {course.description}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {course.outcomes.map((outcome) => (
                      <li
                        key={outcome}
                        className="flex items-start gap-2 text-[12px] leading-snug text-[#51494a] sm:text-[15px]"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 rounded-full bg-[#e50925] p-[3px] text-white" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex justify-center pt-5">
                    <Link
                      href={course.href}
                      className="inline-flex min-w-[155px] items-center justify-center gap-2 rounded-full bg-[#e50925] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#bd1024]"
                    >
                      {course.title.startsWith("Customized") ? "Contact Us" : "Enroll Now"}
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#f1c8cc] bg-[linear-gradient(100deg,#ffe6e9_0%,#fff8f8_50%,#ffe6e9_100%)] px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 items-center gap-y-3 md:grid-cols-5 md:gap-y-0">
          {benefits.slice(0, 2).map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="flex items-center justify-center gap-2 px-2 md:border-r md:border-[#e6aeb4]"
              >
                <Icon className="size-6 shrink-0 text-[#d7192d]" />
                <div>
                  <p className="text-[10px] font-bold text-[#432725]">{benefit.title}</p>
                  <p className="mt-0.5 text-[8px] leading-tight text-[#5e5553]">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
          <div className="col-span-2 flex justify-center border-y border-[#e6aeb4] py-2 md:col-span-1 md:border-y-0 md:border-r">
            <Image
              src="/images/logo-prokrate.png"
              alt="Prokrate International"
              width={459}
              height={124}
              sizes="180px"
              className="w-[150px] object-contain sm:w-[170px]"
            />
          </div>
          {benefits.slice(2).map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="flex items-center justify-center gap-2 px-2 md:border-r md:border-[#e6aeb4] last:border-r-0"
              >
                <Icon className="size-6 shrink-0 text-[#d7192d]" />
                <div>
                  <p className="text-[10px] font-bold text-[#432725]">{benefit.title}</p>
                  <p className="mt-0.5 text-[8px] leading-tight text-[#5e5553]">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
