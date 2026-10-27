import copy from "@/content/en.json";
import registry from "@/content/assets.json";
export const c = copy;
export type Service = (typeof c.services)[number];
export const serviceIds = c.services.map((s) => s.id);
export const activeLocales = ["en"] as const;
export function validLocale(locale: string) {
  return activeLocales.some((l) => l === locale);
}
export function serviceFrom(value?: string | null) {
  return c.services.find((s) => s.id === value);
}
export function href(path: string, locale = "en") {
  if (!validLocale(locale)) throw new Error("Inactive locale");
  if (!path.startsWith("/") || path.startsWith("//"))
    throw new Error("Internal path required");
  return `/${locale}${path === "/" ? "" : path.startsWith("/?") || path.startsWith("/#") ? path.slice(1) : path}`;
}
export type Asset = {
  id: string;
  status: string;
  src: string | null;
  alt: string | null;
  permissionApproved: boolean;
  width?: number;
  height?: number;
};
export const assets: Asset[] = registry.assets;
export function approvedAsset(id: string) {
  const a = assets.find((a) => a.id === id);
  return a?.status === "approved" &&
    a.permissionApproved &&
    a.src &&
    a.width &&
    a.height &&
    a.alt !== null
    ? a
    : undefined;
}
export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  serviceIds: string[];
  coverAssetId: string;
  galleryAssetIds: string[];
  challenge: string;
  approach: string;
  deliverables: string[];
  status: string;
  ownerApproved: boolean;
  clientName?: string;
  year?: string;
};
export function publishable(p: Project) {
  return (
    p.status === "published" &&
    p.ownerApproved &&
    p.serviceIds.length > 0 &&
    p.serviceIds.every((id) => serviceIds.includes(id)) &&
    !!approvedAsset(p.coverAssetId) &&
    p.galleryAssetIds.every((id) => !!approvedAsset(id)) &&
    [p.title, p.summary, p.challenge, p.approach, ...p.deliverables].every(
      (v) => v.trim() && !/lorem ipsum|placeholder|\bTBD\b/i.test(v),
    )
  );
}
export const projects = (c.projects as Project[]).filter(publishable);
export function filteredProjects(service?: string | null) {
  return serviceFrom(service)
    ? projects.filter((p) => p.serviceIds.includes(service!))
    : projects;
}
export const origin = process.env.SITE_URL
  ? new URL(process.env.SITE_URL).origin
  : null;
export const indexable = process.env.SITE_PUBLIC === "true" && !!origin;
