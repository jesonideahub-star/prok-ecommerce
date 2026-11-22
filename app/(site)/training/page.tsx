import type { Metadata } from "next";

import { TrainingPage } from "@/components/training/training-page";

export const metadata: Metadata = {
  title: "Barista Training | Prokrate International",
  description:
    "Hands-on barista courses from the first shot to service — Barista 101, Barista 102, and café team training.",
};

export default function Page() {
  return <TrainingPage />;
}
