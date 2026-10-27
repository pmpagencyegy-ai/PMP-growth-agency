import { notFound } from "next/navigation";
import { validLocale } from "@/lib/content";
import { Header } from "@/components/header";
import { Footer } from "@/components/sections";
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!validLocale(locale)) notFound();
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
