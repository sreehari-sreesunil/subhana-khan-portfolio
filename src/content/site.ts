export const site = {
  portfolioLabel: "Portfolio - Subhana Khan",
  worksLabel: "Selected works - 2021-26",
  cursorEnterLabel: "Enter",
  // Shown on the page-transition sheet.
  pageNames: {
    "/": "Home",
    "/about": "About",
    "/work/ephemeral-ground": "Ephemeral Ground",
  } as Record<string, string>,
  contact: {
    email: "subhana3khan@gmail.com",
    location: "Kochi, Kerala",
  },
  sunPath: {
    label: "The sun over Kochi through the day",
    neutral: "Kochi, Kerala",
    rising: "the sun is rising over the Western Ghats",
    high: "the sun is high over Kochi",
    setting: "the sun is setting over the Arabian Sea",
    night: "night over Kochi",
  },
  footer: {
    thankYou: { src: "/images/thank-you.svg", width: 4196, height: 848, alt: "Thank you" },
    navLabel: "Footer",
    links: [
      { label: "About", href: "/about" },
      { label: "CV", href: "/about#cv" },
    ],
    // Set to the file's path once she provides it; the link stays hidden until then.
    portfolioPdf: null as string | null,
    portfolioPdfLabel: "Download portfolio (PDF)",
    copy: "Copy",
    copied: "Copied",
    copyFailed: "Couldn't copy",
    copyright: "© 2026 Subhana Khan",
  },
};
