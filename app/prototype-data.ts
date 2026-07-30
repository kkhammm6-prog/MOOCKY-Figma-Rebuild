export const asset = (name: string) => `/assets/figma/${name}`;

export type ThemeName = "light" | "dark";

export type ChatChip = {
  label: string;
  icon: string;
};

export const chatChips: ChatChip[] = [
  { label: "Boost My Career Path", icon: "route.svg" },
  { label: "Build My Interest", icon: "fishing-rod.svg" },
  { label: "Analyze my course", icon: "book-open-check.svg" },
  { label: "Inspire Me", icon: "wand-sparkles.svg" },
];

export const popularCourses: Array<{ href?: string; image: string; title: string }> = [
  {
    title: "Ethics of Adaptive Algorithms",
    image: "popular-01.png",
    href: "/courses/ethics-of-adaptive-algorithms",
  },
  {
    title: "Human-Centered AI Systems",
    image: "popular-02.png",
  },
  {
    title: "Climate Data Visualization",
    image: "popular-03.png",
  },
  {
    title: "Cognitive Interface Design",
    image: "popular-04.png",
  },
  {
    title: "Applied Generative Media",
    image: "popular-05.png",
  },
  {
    title: "Responsible Product Analytics",
    image: "popular-06.png",
  },
];

export const domains = [
  {
    title: "Cognitive Science",
    icon: "brain.svg",
    copy: "Map how people think, decide, and retain knowledge.",
    hoverAsset: "domain-gradient-01.png",
  },
  {
    title: "Design Systems",
    icon: "pen-tool.svg",
    copy: "Build reusable UI rules, tokens, and component logic.",
    hoverAsset: "domain-gradient-02.png",
  },
  {
    title: "AI Engineering",
    icon: "square-code.svg",
    copy: "Ship reliable AI workflows from prompts to products.",
    hoverAsset: "domain-gradient-03.png",
  },
  {
    title: "Data Ethics",
    icon: "hard-drive.svg",
    copy: "Evaluate data choices before they become product risk.",
    hoverAsset: "domain-gradient-04.png",
  },
  {
    title: "Digital Arts",
    icon: "paintbrush-vertical.svg",
    copy: "Prototype visual systems with computational tools.",
    hoverAsset: "domain-gradient-05.png",
  },
  {
    title: "Economics",
    icon: "circle-pound-sterling.svg",
    copy: "Read incentives, markets, and policy through cases.",
    hoverAsset: "domain-gradient-06.png",
  },
];

export const recommendations = [
  {
    id: "nature",
    title: "Nature Architecture",
    image: "recommend-01.png",
    description:
      "A masterclass in Cognitive Synthesis. Bridge the gap between biological neural networks and synthetic intelligence through immersive structural design.",
    provider: "Offered By MIT",
    rating: "4.5/5.0",
    reviews: "682 Reviews",
    href: "/courses/nature-architecture",
  },
  {
    id: "quantum",
    title: "Quantum Computing",
    image: "recommend-02.png",
    description:
      "Build a practical map of qubits, gates, and error correction while learning how quantum models reshape optimization and secure systems.",
    provider: "Offered By Caltech",
    rating: "4.7/5.0",
    reviews: "514 Reviews",
  },
  {
    id: "crypto",
    title: "Algorithmic Cryptography",
    image: "recommend-01.png",
    description:
      "Study modern cryptographic systems through algorithmic proofs, threat modeling, and applied protocols for privacy-preserving software.",
    provider: "Offered By Stanford",
    rating: "4.6/5.0",
    reviews: "438 Reviews",
  },
];

export const faqItems = [
  {
    question: "What makes MOOCKY different from other platforms?",
    answer:
      "MOOCKY utilizes cognitive architectural principles to structure learning pathways, ensuring better retention and practical application through AI-assisted dialogue.",
  },
  {
    question: "How do I personalize my learning path?",
    answer:
      "Start with a goal in the AI prompt, then MOOCKY translates your intent into course recommendations, follow-up questions, and context-aware learning suggestions.",
  },
  {
    question: "Are the certificates recognized?",
    answer:
      "Certificates are designed to document completed learning paths and project outcomes. Recognition depends on the partner course or institution attached to each program.",
  },
  {
    question: "Can I access courses offline?",
    answer:
      "Core lessons are designed for online use so AI context, progress, and recommendations stay current. Downloadable resources may be added by individual courses.",
  },
];

export const avatarFiles = Array.from({ length: 15 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return `avatar-${number}.png`;
});

export const starterChats = ["Personalized Suggestion", "Career Path"];

export type AiConversationMode = "newChat" | "personalizedSuggestion" | "careerPath";

export type AiContextTag = {
  type: "currentLesson" | "timestamp" | "courseTitle";
  label: string;
  value: string;
  href?: string;
};

export type AiCourseRecommendationCard = {
  id: string;
  title: string;
  description: string;
  provider: string;
  rating: string;
  reviews: string;
  href: string;
};

export type AiResponseEnvelope = {
  answerKind: "answer" | "refusal" | "clarification";
  surface: "courseRail" | "heroPrompt" | "headerSearch" | "futureSurface";
  conversationTitle: string;
  answerMarkdown: string;
  contextTags: AiContextTag[];
  followUpChips: string[];
  courseRecommendationCards: AiCourseRecommendationCard[];
  courseRecommendationChips?: {
    title: string;
    reason: string;
    query: string;
  }[];
};

export const demoPersonalizedSuggestionCards: AiCourseRecommendationCard[] = [
  {
    id: "nature-architecture",
    title: "Nature Architecture",
    description:
      "A masterclass in Cognitive Synthesis. Bridge the gap between biological neural networks and synthetic intelligence through immersive structural design.",
    provider: "Offered By MIT",
    rating: "4.5/5.0",
    reviews: "682 Reviews",
    href: "/courses/nature-architecture",
  },
  {
    id: "quantum-computing-fundamentals",
    title: "Quantum Computing Fundamentals",
    description: "Map qubits, gates, and quantum algorithms into practical models for next-generation computation and optimization.",
    provider: "Offered By Stanford University",
    rating: "4.7/5.0",
    reviews: "1,239 Reviews",
    href: "/course?course=quantum-computing-fundamentals",
  },
  {
    id: "algorithmic-cryptography",
    title: "Algorithmic Cryptography",
    description: "Study modern cryptographic systems through proofs, threat modeling, and applied protocols for privacy-preserving software.",
    provider: "Offered By Stanford",
    rating: "4.6/5.0",
    reviews: "438 Reviews",
    href: "/course?course=algorithmic-cryptography",
  },
  {
    id: "urban-sustainability",
    title: "Urban Sustainability",
    description: "Design resilient cities by integrating environmental stewardship with adaptive planning, civic systems, and data-informed policy.",
    provider: "Offered By University of Cambridge",
    rating: "4.6/5.0",
    reviews: "987 Reviews",
    href: "/course?course=urban-sustainability",
  },
];

export const fallbackAiResponse: AiResponseEnvelope = {
  answerKind: "answer",
  surface: "heroPrompt",
  conversationTitle: "Course discovery",
  answerMarkdown:
    "MOOCKY AI is ready to help you connect your goals with relevant courses. Ask about a career direction, a topic you want to understand, or the kind of project you want to build.",
  contextTags: [],
  followUpChips: ["Find a course for my career", "Explain the platform", "Build a learning path"],
  courseRecommendationCards: [],
};
