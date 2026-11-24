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

import {
  isPublished,
  mapTrainingRow,
  type TrainingCard,
  uniqueByTitle,
} from "@/lib/cms/public";
import { trainingCourses } from "@/lib/site";
import { createClient } from "@/lib/supabase/client";
import { withSupabaseFallback } from "@/lib/supabase/safe";

const curriculumCourses: TrainingCard[] = trainingCourses.map((course, index) => ({
  id: `fallback-training-${index}`,
  title: course.title,
  description: course.description,
  src: course.src,
  learning_outcomes:
    index === 0
    ? "Coffee History, Introduction to Coffee, Coffee Theory, Specialty Coffee, Cupping & Sensory Skills, Alternative Brewing Method, Cafe Management, Espresso Making"
      : "Milk Steaming & Science Behind It (Latte Art), Preparation of Drinks, Cafe Management, Exploring Coffee Origins, Espresso Prep, Role of Water Brewing, Machine Calibration, Sensory and Brewing",
}));

const courseHighlights = [
  {
    title: "Barista 101",
    description: "Discussion and Insights",
    image: "/images/about-latte.png",
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
    image: "/images/training-hero.png",
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
  {
    title: "Professional Barista Certification",
    description: "Get certified and stand out in the coffee industry.",
    image: "/images/hero-training.png",
    outcomes: ["Hands-on training", "Certification", "Career support"],
    href: "/#contact",
  },
  {
    title: "Customized Training for Businesses",
    description: "Tailored training programs for your team's needs.",
    image: "/images/feature_-_Main_hall_1.jpg",
    outcomes: ["On-site training", "Flexible modules", "Staff skill development"],
    href: "/#contact",
  },
] as const;

const benefits = [
  { icon: Award, title: "Expert Instructors", description: "Learn from industry professionals." },
  { icon: Hand, title: "Hands-On Training", description: "Get practical experience." },
  { icon: Trophy, title: "Certification", description: "Earn a recognized certificate." },
  { icon: UsersRound, title: "Career Support", description: "Grow your coffee career." },
] as const;

function getOutcomes(course: TrainingCard) {
  const outcomes = course.learning_outcomes
    ?.split(/[,;\n•]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (outcomes?.length) return outcomes;

  const fallback = curriculumCourses.find(
    (item) => item.title.trim().toLowerCase() === course.title.trim().toLowerCase()
  );
  return fallback?.learning_outcomes
    ?.split(/[,;\n•]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function TrainingPage() {
  const [courses, setCourses] = useState<TrainingCard[]>(curriculumCourses);

  useEffect(() => {
    const supabase = createClient();
    void withSupabaseFallback(async () => {
      const { data } = await supabase.from("training_courses").select("*").order("sort_order");
      const rows = ((data ?? []) as Record<string, unknown>[]).filter(isPublished);
      if (rows.length) setCourses(uniqueByTitle(rows.map(mapTrainingRow)));
    });
  }, []);

  return (
    <main className="flex-1 bg-[#fff7f7] text-[#292226]">
      <section className="relative isolate min-h-[245px] overflow-hidden border-y border-[#f2b2ba] bg-[linear-gradient(105deg,#fff8f8_0%,#ffe8eb_45%,#f7b7c1_100%)] sm:min-h-[280px]">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-[120px] -top-[320px] size-[620px] rounded-full border-[26px] border-white/65" />
          <div className="absolute left-[18%] -top-[390px] size-[700px] rounded-full border-[22px] border-[#f19aa8]/25" />
          <div className="absolute right-[-130px] -bottom-[330px] size-[600px] rounded-full border-[28px] border-white/50" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(170deg,transparent 0_43%,rgba(226,24,51,.13) 44%_52%,transparent 53%)]" />
        </div>
        <div className="absolute inset-y-0 right-0 w-full sm:w-[62%]">
          <Image
            src="/images/training-hero.png"
            alt="Barista instructor demonstrating latte art to a training class"
            fill
            preload
            sizes="(min-width: 640px) 62vw, 100vw"
            className="object-cover object-[62%_42%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff8f8_0%,rgba(255,248,248,.96)_5%,rgba(255,248,248,.78)_24%,rgba(255,248,248,.08)_62%,rgba(0,0,0,.25)_100%)] sm:bg-[linear-gradient(90deg,#fff8f8_0%,rgba(255,248,248,.9)_10%,rgba(255,248,248,.08)_48%,rgba(0,0,0,.22)_100%)]" />
          <p className="absolute right-[5%] bottom-7 hidden max-w-[125px] font-serif text-[20px] leading-[1.05] text-white italic drop-shadow-md sm:block">
            Learn.
            <br />
            Practice.
            <br />
            Excel.
          </p>
        </div>
        <div className="relative mx-auto flex min-h-[245px] max-w-[1440px] items-center px-5 py-5 sm:min-h-[280px] sm:px-8 lg:px-14">
          <div className="relative z-10 max-w-[90%] sm:max-w-[50%]">
            <p className="text-[10px] font-bold tracking-[0.14em] text-[#d7182e] uppercase sm:text-[12px]">
              Barista Training
            </p>
            <h1 className="mt-2 font-serif text-[34px] leading-[.94] font-medium text-[#482326] sm:text-[42px] lg:text-[50px]">
              Professional
              <span className="block font-bold text-[#d7192d] italic">Barista Training</span>
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
        </div>
      </section>

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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            {courseHighlights.map((course) => (
              <article
                key={course.title}
                className="flex min-w-0 flex-col overflow-hidden rounded-[12px] border border-[#f2d6d7] bg-white/75 shadow-[0_3px_12px_rgba(115,38,44,.04)]"
              >
                <div className="relative aspect-[1.48] overflow-hidden bg-[#eee8e4]">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <h3 className="font-serif text-[15px] leading-[1.05] font-bold text-[#432725]">
                    {course.title}
                  </h3>
                  <p className="mt-1.5 text-[10px] leading-snug text-[#5e5553]">
                    {course.description}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {course.outcomes.map((outcome) => (
                      <li
                        key={outcome}
                        className="flex items-start gap-1.5 text-[9px] leading-tight text-[#51494a]"
                      >
                        <Check className="mt-px size-[10px] shrink-0 rounded-full bg-[#e50925] p-[2px] text-white" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex justify-center pt-3">
                    <Link
                      href={course.href}
                      className="inline-flex min-w-[98px] items-center justify-center gap-1.5 rounded-full bg-[#e50925] px-3 py-1.5 text-[10px] font-semibold text-white transition-colors hover:bg-[#bd1024]"
                    >
                      {course.title.startsWith("Customized") ? "Contact Us" : "Enroll Now"}
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-1 pb-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-2 flex items-center gap-3">
            <h2 className="shrink-0 font-serif text-[20px] font-bold text-[#492829] sm:text-[23px]">
              Course Curriculum
            </h2>
            <span className="h-px flex-1 bg-[#ef8e98]" />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {courses.map((course) => {
              const outcomes = getOutcomes(course) ?? [];
              const details = [
                course.overview,
                course.requirements,
                course.schedule,
                course.instructor,
                course.location,
                course.price != null ? `₱ ${course.price.toLocaleString("en-PH")}` : undefined,
                course.contact_info,
              ].filter(Boolean);

              return (
                <article
                  key={course.id}
                  className="flex flex-col rounded-[12px] border border-[#f1d7d8] bg-white/60 p-3 sm:p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative h-[70px] w-[145px] shrink-0 overflow-hidden rounded-md bg-[#eee] shadow-sm sm:h-[82px] sm:w-[185px]">
                      <Image
                        src={course.src}
                        alt={course.title}
                        fill
                        sizes="(min-width: 640px) 185px, 145px"
                        className="object-contain"
                      />
                    </div>
                    <div className="min-w-0 pt-1">
                      <h3 className="font-serif text-[16px] font-bold text-[#d7192d] sm:text-[18px]">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-[9px] text-[#62595a]">{course.description}</p>
                      {course.duration || course.price != null ? (
                        <p className="mt-1 text-[9px] text-[#62595a]">
                          {[course.duration, course.price != null ? `₱ ${course.price.toLocaleString("en-PH")}` : null]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  {outcomes.length ? (
                    <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 pl-4 text-[9px] leading-tight text-[#554d4c] sm:grid-cols-2">
                      {outcomes.map((outcome) => (
                        <li key={outcome} className="list-disc">
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {details.length ? (
                    <details className="mt-2 text-[9px] text-[#62595a]">
                      <summary className="cursor-pointer font-semibold text-[#9b4b28]">
                        Additional course details
                      </summary>
                      <div className="mt-1 space-y-0.5">
                        {course.overview ? <p>{course.overview}</p> : null}
                        {course.requirements ? <p>Requirements: {course.requirements}</p> : null}
                        {course.schedule ? <p>Schedule: {course.schedule}</p> : null}
                        {course.instructor ? <p>Instructor: {course.instructor}</p> : null}
                        {course.location ? <p>Location: {course.location}</p> : null}
                        {course.contact_info ? <p>{course.contact_info}</p> : null}
                      </div>
                    </details>
                  ) : null}
                  <Link
                    href={course.enrollment_href || "/#contact"}
                    className="mt-3 inline-flex items-center justify-center rounded-md bg-[#8b4a27] px-3 py-1.5 text-[10px] font-medium text-white transition-colors hover:bg-[#6e371d]"
                  >
                    View Course Details
                  </Link>
                </article>
              );
            })}
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
