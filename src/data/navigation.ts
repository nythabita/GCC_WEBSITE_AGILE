export type NavChild = { label: string; path: string };
export type NavItem = { label: string; path: string; children?: NavChild[] };

// Site structure (latest Figma): Home is the landing page; Discover, Learn, Apply and Grow are the
// four stages of the journey. "Discover" is the Tentang GCC page.
export const navigation: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Discover", path: "/discover" },
  { label: "Learn", path: "/learn", children: [{ label: "GrowthCamp", path: "/learn/growthcamp" }] },
  {
    label: "Apply",
    path: "/apply",
    children: [
      { label: "Explore Programs", path: "/programs" },
      { label: "GrowthX Mentoring", path: "/apply/growthx" },
      { label: "GrowthConnect", path: "/apply/growthconnect" },
    ],
  },
  { label: "Grow", path: "/grow" },
];

// Pages without a design yet use the existing Coming Soon preview.
export const secondaryNavigation: NavChild[] = [
  { label: "Assessment", path: "/assessment" },
  { label: "Login", path: "/login" },
];

// Footer labels follow the Figma footer; Discover and Tentang GCC are the same page.
export const footerNavigation: NavChild[] = [
  { label: "Discover", path: "/discover" },
  { label: "Learn", path: "/learn" },
  { label: "Apply", path: "/apply" },
  { label: "Grow", path: "/grow" },
  { label: "Tentang GCC", path: "/discover" },
  { label: "Assessment", path: "/assessment" },
];

// The Explore Page (/programs) is labelled "Apply" in the Figma navbar.
const sectionLabels: NavChild[] = [...navigation, ...secondaryNavigation, { label: "Apply", path: "/programs" }];

export function isPathActive(pathname: string, path: string) {
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}

// Label shown beside the menu button on mobile. Unknown paths render the homepage, so they read as Home.
export function getSectionLabel(pathname: string) {
  return sectionLabels.find((item) => item.path !== "/" && isPathActive(pathname, item.path))?.label ?? "Home";
}
