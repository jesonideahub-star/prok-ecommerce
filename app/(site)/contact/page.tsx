import type { Metadata } from "next";

import { ContactPage } from "@/components/contact/contact-page";

export const metadata: Metadata = {
  title: "Contact Us | Prokrate International",
  description:
    "Contact Prokrate International for coffee product inquiries, barista training, services, and partnerships.",
};

export default function Page() {
  return <ContactPage />;
}
