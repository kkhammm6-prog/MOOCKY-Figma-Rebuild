import type { LumenIconName } from "../components/LumenIcon";

export type PublicCourseModule = {
  id: string;
  lessons: string[];
  meta: string;
  title: string;
};

export type PublicCourseOutcome = {
  copy: string;
  hoverAsset: string;
  icon: LumenIconName;
  title: string;
};

export type PublicCourseTestimonial = {
  initials: string;
  name: string;
  quote: string;
  role: string;
};

export type PublicCourseDetail = {
  about: {
    highlights: string[];
    paragraphs: string[];
    title: string;
  };
  aiHeading: string;
  aiPrompts: string[];
  body: string;
  category: string;
  heroImage: {
    alt: string;
    prompt: string;
    src: string;
  };
  instructor: {
    avatar: string;
    bullets: string[];
    name: string;
    prefix: string;
    role: string;
  };
  modules: PublicCourseModule[];
  outcomes: PublicCourseOutcome[];
  rating: {
    label: string;
    reviews: string;
  };
  slug: string;
  subtitle: string;
  testimonials: PublicCourseTestimonial[];
  title: string;
  titleFirstWord: string;
  titleRemainder: string;
};

const sharedIncluded: Array<{ icon: LumenIconName; label: string }> = [
  { icon: "badge-check", label: "Certificate of Completion" },
  { icon: "clock-3", label: "Lifetime Access" },
  { icon: "sparkle", label: "AI-Powered Study Guide" },
  { icon: "message-circle-question", label: "Community Discussion" },
  { icon: "book-open-check", label: "24 Downloadable Frameworks" },
];

export const included = sharedIncluded;

export const publicCourseDetails: Record<string, PublicCourseDetail> = {
  "cognitive-interface-architecture": {
    about: {
      highlights: ["Biological Blueprint", "Synthetic Synapses"],
      paragraphs: [
        "Welcome to the frontier of cognitive engineering. This course is about architecting the bridges between human thought and algorithmic execution. We explore the Biological Blueprint of the brain and translate it into Synthetic Synapses.",
        "Designed for senior developers, cognitive scientists, and product designers, the course moves beyond code into the philosophy of interface. By the end, you will have frameworks for systems that support human cognition instead of overwhelming it.",
      ],
      title: "The Architect's Vision",
    },
    aiHeading: "Ask better questions while the lesson is still fresh.",
    aiPrompts: ["Explain the current timestamp", "Generate a study guide", "Compare concepts across modules"],
    body: "A masterclass in cognitive synthesis. Bridge biological neural networks and synthetic intelligence through immersive structural design.",
    category: "Computer Science",
    heroImage: {
      alt: "Abstract translucent cognitive interface architecture model arranged over layered glass and blue-green study planes",
      prompt:
        "Course promotional image for Cognitive Interface Architecture: a translucent brain-like interface model above layered glass study planes, soft daylight, premium editorial composition, quiet blue-green palette, no text.",
      src: "/assets/generated/neural-architecture-course-promo.png",
    },
    instructor: {
      avatar: "DA",
      bullets: ["Taught 3000+ students in MOOCKY", "Associate Professor at MIT"],
      name: "Aris Thorne",
      prefix: "Dr.",
      role: "Lead AI Architect",
    },
    modules: [
      {
        id: "01",
        title: "The Biological Blueprint",
        meta: "4 lectures - 2.5 hours",
        lessons: ["Neurons as signals", "From perception to pattern", "Interface metaphors that age well"],
      },
      {
        id: "02",
        title: "Synthetic Synapses",
        meta: "6 lectures - 4 hours",
        lessons: ["Embedding memory into flows", "Designing adaptive systems", "Prompt context as product material"],
      },
      {
        id: "03",
        title: "Architecture of Attention",
        meta: "5 lectures - 3 hours",
        lessons: ["Reducing cognitive load", "Rhythm for AI-assisted tasks", "Designing for human agency"],
      },
    ],
    outcomes: [
      {
        icon: "network",
        title: "Map neural systems",
        copy: "Translate cognitive models into practical interface decisions.",
        hoverAsset: "/assets/figma/domain-gradient-01.png",
      },
      {
        icon: "waypoints",
        title: "Design AI pathways",
        copy: "Build learning flows that reveal context at the right moment.",
        hoverAsset: "/assets/figma/domain-gradient-03.png",
      },
      {
        icon: "gauge",
        title: "Reduce cognitive load",
        copy: "Use structure, pacing, and feedback to keep learners oriented.",
        hoverAsset: "/assets/figma/domain-gradient-04.png",
      },
      {
        icon: "scan-eye",
        title: "Guide with MOOCKY AI",
        copy: "Pair lessons with contextual questions and study prompts.",
        hoverAsset: "/assets/figma/domain-gradient-06.png",
      },
    ],
    rating: {
      label: "4.9/5.0",
      reviews: "2,480 Reviews",
    },
    slug: "cognitive-interface-architecture",
    subtitle: "Designing the Mind-Machine Interface",
    testimonials: [
      {
        quote: "The course made AI interaction feel concrete. I finally had a language for designing with cognitive load in mind.",
        name: "Elena Rodriguez",
        role: "AI Ethicist",
        initials: "ER",
      },
      {
        quote: "The examples are practical without becoming shallow. The first module alone changed how my team sketches flows.",
        name: "Marcus Thorne",
        role: "Senior Design Lead",
        initials: "MT",
      },
      {
        quote: "It connects neuroscience, product strategy, and interface design in a way that feels useful on Monday morning.",
        name: "Priya Desai",
        role: "Cognitive Scientist",
        initials: "PD",
      },
    ],
    title: "Cognitive Interface Architecture",
    titleFirstWord: "Cognitive",
    titleRemainder: "Interface Architecture",
  },
  "nature-architecture": {
    about: {
      highlights: ["Living Pattern Library", "Regenerative Spatial Strategy"],
      paragraphs: [
        "Nature Architecture studies how forests, shells, roots, and terrain solve spatial problems before a building ever appears on a drawing board. The course turns these references into a Living Pattern Library for resilient structures.",
        "Designed for architects, product-minded designers, and climate-focused builders, the course moves from observation to studio method. By the end, you will have practical frameworks for spaces that work with material cycles, light, air, and human attention.",
      ],
      title: "The Architect's Vision",
    },
    aiHeading: "Ask nature-led questions while patterns are fresh.",
    aiPrompts: ["Explain the current timestamp", "Generate a site ecology guide", "Compare patterns across modules"],
    body: "A studio course in biomimetic design. Study forests, shells, terrain, and climate patterns to shape resilient architectural systems.",
    category: "Design Systems",
    heroImage: {
      alt: "Soft translucent biomorphic architecture model over layered glass planes with subtle grain and gentle blur",
      prompt:
        "Course promotional image for Nature Architecture: a translucent biomorphic pavilion model arranged over layered glass study planes, soft daylight, premium editorial composition, quiet blue-green and warm botanical accents, subtle film grain and gentle depth blur, no text.",
      src: "/assets/generated/nature-architecture-course-promo.png",
    },
    instructor: {
      avatar: "LM",
      bullets: ["Taught 1800+ students in MOOCKY", "Visiting Studio Critic at MIT"],
      name: "Lena Mori",
      prefix: "Prof.",
      role: "Ecological Design Architect",
    },
    modules: [
      {
        id: "01",
        title: "Patterns in Living Systems",
        meta: "4 lectures - 2 hours",
        lessons: ["Branching, shells, and growth logic", "Reading landscapes as structure", "From natural precedent to spatial rule"],
      },
      {
        id: "02",
        title: "Materials and Microclimates",
        meta: "5 lectures - 3.5 hours",
        lessons: ["Light, shade, and thermal comfort", "Bio-based material assemblies", "Designing with water and air flow"],
      },
      {
        id: "03",
        title: "Regenerative Spatial Strategy",
        meta: "5 lectures - 3 hours",
        lessons: ["Circular site systems", "Human attention in natural spaces", "Studio critique and final framework"],
      },
    ],
    outcomes: [
      {
        icon: "leaf",
        title: "Read natural patterns",
        copy: "Translate living systems into usable spatial principles.",
        hoverAsset: "/assets/figma/domain-gradient-05.png",
      },
      {
        icon: "drafting-compass",
        title: "Shape organic structures",
        copy: "Build architectural concepts from material and terrain logic.",
        hoverAsset: "/assets/figma/domain-gradient-02.png",
      },
      {
        icon: "cloud-sun",
        title: "Balance microclimates",
        copy: "Use light, airflow, and shade as part of the design system.",
        hoverAsset: "/assets/figma/domain-gradient-06.png",
      },
      {
        icon: "tree-pine",
        title: "Design regenerative sites",
        copy: "Connect buildings, landscapes, and maintenance cycles.",
        hoverAsset: "/assets/figma/domain-gradient-01.png",
      },
    ],
    rating: {
      label: "4.5/5.0",
      reviews: "682 Reviews",
    },
    slug: "nature-architecture",
    subtitle: "Designing with Living Systems",
    testimonials: [
      {
        quote: "The course changed how I start a site study. Natural patterns became practical constraints, not just mood references.",
        name: "Maya Chen",
        role: "Architectural Designer",
        initials: "MC",
      },
      {
        quote: "The material and microclimate module gave our team a sharper way to talk about comfort, shade, and maintenance.",
        name: "Owen Patel",
        role: "Urban Systems Lead",
        initials: "OP",
      },
      {
        quote: "It keeps the poetry of nature but turns it into decisions you can draw, test, and explain to clients.",
        name: "Nadia Flores",
        role: "Landscape Strategist",
        initials: "NF",
      },
    ],
    title: "Nature Architecture",
    titleFirstWord: "Nature",
    titleRemainder: "Architecture",
  },
  "ethics-of-adaptive-algorithms": {
    about: {
      highlights: ["Adaptive Risk Map", "Accountability Review Loop"],
      paragraphs: [
        "Ethics of Adaptive Algorithms examines systems that keep learning after launch, where product behavior, user data, and model updates reshape each other. The course turns vague ethical concern into an Adaptive Risk Map for practical product decisions.",
        "Designed for AI product teams, data leads, and policy-minded engineers, the course moves from principles to review rituals. By the end, you will have an Accountability Review Loop for deciding when adaptive systems should learn, pause, explain, or escalate.",
      ],
      title: "The Reviewer's Lens",
    },
    aiHeading: "Ask sharper ethics questions while models adapt.",
    aiPrompts: ["Explain this decision point", "Generate an audit checklist", "Compare fairness tradeoffs"],
    body: "A practical course in algorithmic accountability. Learn how adaptive systems shift incentives, risk, and responsibility as they respond to real-world behavior.",
    category: "Data Ethics",
    heroImage: {
      alt: "Translucent decision lattice and accountability model over layered glass planes with subtle grain and gentle blur",
      prompt:
        "Course promotional image for Ethics of Adaptive Algorithms: a translucent decision lattice and algorithmic accountability model arranged over layered glass study planes, adaptive feedback loops shown as delicate etched pathways, soft daylight, premium editorial composition, quiet blue-green foundation with warm amber ethical review accents, subtle film grain and gentle depth blur, no text.",
      src: "/assets/generated/ethics-adaptive-algorithms-course-promo-imagegen.png",
    },
    instructor: {
      avatar: "MK",
      bullets: ["Taught 2200+ students in MOOCKY", "Fellow in Algorithmic Accountability at MIT"],
      name: "Mara Kline",
      prefix: "Dr.",
      role: "Algorithmic Accountability Researcher",
    },
    modules: [
      {
        id: "01",
        title: "Adaptive Risk Foundations",
        meta: "4 lectures - 2.5 hours",
        lessons: ["When models keep changing", "Feedback loops and hidden incentives", "Mapping harm before deployment"],
      },
      {
        id: "02",
        title: "Fairness Under Drift",
        meta: "5 lectures - 3 hours",
        lessons: ["Distribution shifts in product data", "Tradeoffs across user groups", "Signals that need human review"],
      },
      {
        id: "03",
        title: "Accountable Release Systems",
        meta: "5 lectures - 3 hours",
        lessons: ["Thresholds, pauses, and appeals", "Documentation that teams can use", "Final adaptive algorithm review"],
      },
    ],
    outcomes: [
      {
        icon: "scale",
        title: "Audit ethical tradeoffs",
        copy: "Compare fairness, utility, and user agency before release.",
        hoverAsset: "/assets/figma/domain-gradient-04.png",
      },
      {
        icon: "git-branch",
        title: "Trace adaptive changes",
        copy: "Map how feedback loops alter model behavior over time.",
        hoverAsset: "/assets/figma/domain-gradient-03.png",
      },
      {
        icon: "shield-check",
        title: "Set review thresholds",
        copy: "Define when a system should pause, escalate, or explain.",
        hoverAsset: "/assets/figma/domain-gradient-06.png",
      },
      {
        icon: "sliders-horizontal",
        title: "Tune accountable rules",
        copy: "Turn policy principles into usable product constraints.",
        hoverAsset: "/assets/figma/domain-gradient-02.png",
      },
    ],
    rating: {
      label: "4.8/5.0",
      reviews: "1,146 Reviews",
    },
    slug: "ethics-of-adaptive-algorithms",
    subtitle: "Governing Systems That Learn",
    testimonials: [
      {
        quote: "This made algorithmic governance feel operational. We left with rituals our product team could actually adopt.",
        name: "Samira Holt",
        role: "Responsible AI Lead",
        initials: "SH",
      },
      {
        quote: "The drift module clarified why our review process had to continue after launch, not stop at approval.",
        name: "Jon Bell",
        role: "Data Product Manager",
        initials: "JB",
      },
      {
        quote: "It balances ethics and engineering without turning either side into theater. The checklists are immediately useful.",
        name: "Leah Okafor",
        role: "Machine Learning Engineer",
        initials: "LO",
      },
    ],
    title: "Ethics of Adaptive Algorithms",
    titleFirstWord: "Ethics",
    titleRemainder: "of Adaptive Algorithms",
  },
};

export const defaultPublicCourseSlug = "cognitive-interface-architecture";

export function getPublicCourseDetail(slug?: string | null) {
  if (!slug) {
    return publicCourseDetails[defaultPublicCourseSlug];
  }

  return publicCourseDetails[slug] ?? publicCourseDetails[defaultPublicCourseSlug];
}
