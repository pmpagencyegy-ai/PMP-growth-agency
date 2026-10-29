import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { c, origin, projects, serviceFrom, validLocale } from "@/lib/content";
import {
  Home,
  About,
  Contact,
  Privacy,
  Services,
  ServicePage,
  WorkPage,
  ProjectPreview,
} from "@/components/pages";
import { CaseStudy } from "@/components/sections";
import { landingProjects } from "@/lib/landing-data";
type Params = { locale: string; path?: string[] };
function resolve(p: Params) {
  if (!validLocale(p.locale)) return;
  const path = (p.path || []).join("/");
  if (!path) return { view: <Home />, seo: c.home.seo };
  if (path === "services")
    return { view: <Services />, seo: c.servicesPage.seo };
  if (path === "work") return { view: <WorkPage />, seo: c.workPage.seo };
  if (path === "about") return { view: <About />, seo: c.aboutPage.seo };
  if (path === "contact") return { view: <Contact />, seo: c.contactPage.seo };
  if (path === "privacy")
    return {
      view: <Privacy />,
      seo: {
        title: "Privacy Notice | PMP",
        description:
          "Information about contacting PMP and the use of inquiry details.",
      },
    };
  if (p.path?.length === 2 && p.path[0] === "services") {
    const s = serviceFrom(p.path[1]);
    if (s) return { view: <ServicePage service={s} />, seo: s.seo };
  }
  if (p.path?.length === 2 && p.path[0] === "work") {
    const project = projects.find((x) => x.slug === p.path![1]);
    if (project)
      return {
        view: <CaseStudy project={project} />,
        seo: { title: `${project.title} | PMP`, description: project.summary },
      };
    const previewProject = landingProjects.find((x) => x.id === p.path![1]);
    if (previewProject)
      return {
        view: <ProjectPreview project={previewProject} />,
        seo: {
          title: `${previewProject.title} | PMP`,
          description: `${previewProject.category} project preview by PMP.`,
          robots: { index: false, follow: false },
        },
      };
  }
}
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const p = await params;
  const r = resolve(p);
  if (!r)
    return {
      title: "Page not found | PMP",
      robots: { index: false, follow: false },
    };
  return {
    ...r.seo,
    alternates: origin
      ? {
          canonical: `${origin}/${p.locale}${p.path?.length ? `/${p.path.join("/")}` : ""}`,
        }
      : undefined,
    openGraph: { ...r.seo, type: "website", locale: "en_EG", siteName: "PMP" },
  };
}
export default async function Page({ params }: { params: Promise<Params> }) {
  const result = resolve(await params);
  if (!result) notFound();
  return result.view;
}
