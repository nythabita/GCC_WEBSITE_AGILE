export type NavChild = { label: string; path: string };
export type NavItem = { label: string; path: string; children?: NavChild[] };

// Main navigation: desktop bar and the mobile drawer. Learn/Apply/Grow stay preview pages.
export const navigation: NavItem[] = [
  { label: "Discover", path: "/" },
  { label: "Learn", path: "/learn", children: [{ label: "GrowthCamp", path: "/learn" }] },
  {
    label: "Apply",
    path: "/apply",
    children: [
      { label: "GrowthX Mentoring", path: "/apply" },
      { label: "GrowthConnect", path: "/apply" },
    ],
  },
  { label: "Grow", path: "/grow" },
];

// Pages without a design yet use the existing Coming Soon preview.
export const secondaryNavigation: NavChild[] = [
  { label: "Tentang GCC", path: "/about" },
  { label: "Login", path: "/login" },
];

export const footerNavigation: NavChild[] = [
  { label: "Discover", path: "/" },
  { label: "Learn", path: "/learn" },
  { label: "Apply", path: "/apply" },
  { label: "Grow", path: "/grow" },
  { label: "Tentang GCC", path: "/about" },
  { label: "Assessment", path: "/assessment" },
];

const sectionLabels: NavChild[] = [...navigation, ...secondaryNavigation, { label: "Assessment", path: "/assessment" }];

export function isPathActive(pathname: string, path: string) {
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}

// Label shown beside the menu button on mobile. Unknown paths render the homepage, so they read as Home (the label in the latest Figma navbar).
export function getSectionLabel(pathname: string) {
  return sectionLabels.find((item) => item.path !== "/" && isPathActive(pathname, item.path))?.label ?? "Home";
}
