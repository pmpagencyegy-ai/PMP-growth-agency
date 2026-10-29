export const aboutPanels = [
  {
    id: "about-pmp",
    tab: "ABOUT PMP",
    vertical: "ABOUT PMP",
    title: "About PMP",
    titleWhite: "About",
    titleAccent: "PMP",
    summary:
      "PMP is an integrated marketing agency for businesses ready to grow with purpose.",
    image: "/media/about/about.webp",
    details: [
      "PMP is an integrated marketing agency for businesses ready to grow with purpose. We believe every brand has the potential to become more—and we’re here to help shape what comes next.",
      "We work with businesses to understand their goals, uncover what makes them different, and turn that understanding into marketing that feels connected and true to their brand. Because meaningful growth starts with knowing who you are—and where you want to go.",
      "At PMP, every partnership begins with a conversation and grows into a shared vision for what’s possible.",
    ],
  },
  {
    id: "vision",
    tab: "VISION",
    vertical: "VISION",
    title: "Our Vision",
    titleWhite: "Our",
    titleAccent: "Vision",
    summary: "A future where ambitious brands don’t just grow—they lead.",
    image: "/media/about/vision.webp",
    details: [
      "A future where ambitious brands don’t just grow—they lead.",
      "We envision becoming a trusted partner to businesses shaping what comes next. By bringing clarity to their direction and purpose to the way they connect with people, we aim to help brands create progress that lasts.",
    ],
  },
  {
    id: "mission",
    tab: "MISSION",
    vertical: "MISSION",
    title: "Our Mission",
    titleWhite: "Our",
    titleAccent: "Mission",
    summary:
      "Helping ambitious businesses turn their next move into meaningful progress.",
    image: "/media/about/mission.webp",
    details: [
      "Helping ambitious businesses turn their next move into meaningful progress.",
      "We bring strategy, creativity, production, and media together around each business’s goals. We start by understanding where you want to go, then work alongside you to create marketing that helps you get there with clarity and confidence.",
    ],
  },
  {
    id: "founder",
    tab: "CEO & FOUNDER",
    vertical: "CEO & FOUNDER",
    title: "CEO & Founder",
    titleWhite: "CEO &",
    titleAccent: "Founder",
    summary: "Meet Mohamed El Masry—the entrepreneur shaping PMP’s vision.",
    image: "/media/about/ceo.webp",
    details: [
      "Mohamed is an Egyptian entrepreneur and business leader with experience building and developing businesses across the Middle East and Asia. He holds a PhD in Entrepreneurship and Business Administration from the British University in Egypt and serves as a diplomatic adviser to UNICEF.",
      "His ventures include Cairo White Agency, Platinum Marketing Pulse, MTP Network Development, and Quality PG. He has contributed to the establishment and structuring of more than 29 companies. He is also the author of Keys to Life, which is set to be translated into additional languages.",
    ],
  },
  {
    id: "why-us",
    tab: "WHY US",
    vertical: "WHY US",
    title: "Why PMP?",
    titleWhite: "Why",
    titleAccent: "PMP?",
    summary: "Because the best marketing starts by seeing the bigger picture.",
    image: "/media/about/why.webp",
    details: [
      "Because the best marketing starts by seeing the bigger picture.",
      "We look beyond individual tasks to understand how every part of your marketing connects to your business goals. Our team brings different perspectives together, asks thoughtful questions, and works with you to decide what to do next.",
    ],
  },
] as const;

export const landingServices = [
  {
    id: "production",
    title: "PRODUCTION",
    description:
      "From concept to the final cut, we create films and content that move your brand forward.",
    image: "/media/services/production.webp",
    icon: "/media/services/production-icon.png",
    href: "/en/services/production",
  },
  {
    id: "designs",
    title: "DESIGNS",
    description:
      "Build a distinctive identity that people recognize, remember, and connect with.",
    image: "/media/services/designs.webp",
    icon: "/media/services/designs-icon.png",
    href: "/en/services/branding",
  },
  {
    id: "media-coverage",
    title: "MEDIA COVERAGE",
    description:
      "Capture your events with expert photography and video coverage, turning key moments into stories.",
    image: "/media/services/media-coverage.webp",
    icon: "/media/services/media-coverage-icon.png",
    href: "/en/services/media-coverage",
  },
  {
    id: "social-media",
    title: "SOCIAL MEDIA",
    description:
      "Strategy, content, and community management that keep your brand part of the conversation.",
    image: "/media/services/social-media.webp",
    icon: "/media/services/social-media-icon.png",
    href: "/en/services/social-media",
  },
  {
    id: "media-buying",
    title: "MEDIA BUYING",
    description:
      "Reach the right audience with paid campaigns built around your business goals.",
    image: "/media/services/media-buying.webp",
    icon: "/media/services/media-buying-icon.png",
    href: "/en/services/media-buying",
  },
] as const;

export const typographyFrames = [
  { lines: ["ELEVATE", "YOUR BUSINESS."], accent: 1 },
  { lines: ["SMART", "MARKETING."], accent: 1 },
  { lines: ["Built around your ambition."], accent: -1 },
  { lines: ["REAL", "IMPACT."], accent: 1 },
  {
    lines: ["Elevate your business.", "Smart marketing. Real impact."],
    accent: 1,
  },
  {
    lines: ["Strategy, creativity and execution.", "Built for your next move."],
    accent: -1,
  },
  { lines: ["See it in our work."], accent: -1 },
] as const;

export const landingProjects = [
  {
    id: "alfredo",
    number: "01",
    title: "Alfredo",
    category: "Brand Identity / Packaging",
    shortCategory: "Branding",
    image: "/media/work/alfredo.webp",
    thumbnail: "/media/work/alfredo-thumb.webp",
  },
  {
    id: "pmp-brand-campaign",
    number: "02",
    title: "PMP Brand Campaign",
    category: "Production / Media Buying / Social Media",
    shortCategory: "Production / Media Buying / Social Media",
    image: "/media/work/pmp-brand-campaign.webp",
    thumbnail: "/media/work/pmp-brand-campaign-thumb.webp",
  },
  {
    id: "zain",
    number: "03",
    title: "Zain",
    category: "Media Buying",
    shortCategory: "Media Buying",
    image: "/media/work/zain.webp",
    thumbnail: "/media/work/zain-thumb.webp",
  },
  {
    id: "tawfeek",
    number: "04",
    title: "Tawfeek",
    category: "Social Media",
    shortCategory: "Social Media",
    image: "/media/work/tawfeek.webp",
    thumbnail: "/media/work/tawfeek-thumb.webp",
  },
] as const;

export type LandingProject = (typeof landingProjects)[number];

export const industries = [
  ["Fashion", "Style that earns attention."],
  ["Beauty Brands", "Build beauty people believe in."],
  ["Real Estate", "Bring every property’s story to life."],
  ["Electronics", "Make innovation easy to understand."],
  ["Furniture", "Design made desirable."],
  ["Doctors & Clinics", "Build confidence in your care."],
  ["Construction & Engineering", "Make your expertise visible."],
  ["Transportation", "Keep your brand moving forward."],
  ["Food & Beverage", "Make every flavour memorable."],
  ["E-commerce", "Turn browsing into buying."],
  ["Education", "Inspire the next step in learning."],
] as const;

export const clientCards = Array.from({ length: 11 }, (_, index) => [
  `/media/clients/client-1-${String(index + 1).padStart(2, "0")}.png`,
  `/media/clients/client-2-${String(index + 1).padStart(2, "0")}.png`,
]).flat();
