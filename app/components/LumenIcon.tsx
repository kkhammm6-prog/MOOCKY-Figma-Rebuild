import {
  ArrowLeft,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BadgeCheck,
  BadgePlus,
  Bell,
  BookmarkCheck,
  BookOpenCheck,
  Brain,
  Briefcase,
  ChevronDown,
  ChessPawn,
  ChevronsRightLeft,
  Circle,
  CirclePause,
  CirclePlay,
  CirclePoundSterling,
  CircleUser,
  Clock3,
  Coins,
  Copy,
  Camera,
  ClosedCaption,
  CloudSun,
  DraftingCompass,
  Eclipse,
  File,
  FileCode2,
  FishingRod,
  Gauge,
  GitBranch,
  HardDrive,
  History,
  Info,
  Image,
  Leaf,
  ListChecks,
  Loader,
  Bubbles,
  MessageCircleQuestion,
  Minimize,
  Moon,
  Network,
  PaintbrushVertical,
  PanelLeftClose,
  PanelLeftOpen,
  PenTool,
  PencilLine,
  Plus,
  Road,
  Radio,
  Route,
  Save,
  Scan,
  ScanEye,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkle,
  SquareCode,
  Target,
  Scale,
  ThumbsDown,
  ThumbsUp,
  Upload,
  Video,
  Volume1,
  WandSparkles,
  TreePine,
  Waypoints,
  X,
  type LucideIcon,
} from "lucide-react";

const ICONS = {
  "ai-sparkle": Sparkle,
  "arrow-left": ArrowLeft,
  "arrow-down": ArrowDown,
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  "arrow-up-right": ArrowUpRight,
  "badge-check": BadgeCheck,
  "badge-plus": BadgePlus,
  bell: Bell,
  "bookmark-check": BookmarkCheck,
  "book-open-check": BookOpenCheck,
  brain: Brain,
  briefcase: Briefcase,
  "chess-pawn": ChessPawn,
  "chevrons-right-left": ChevronsRightLeft,
  circle: Circle,
  "circle-pause": CirclePause,
  "circle-play": CirclePlay,
  "circle-pound-sterling": CirclePoundSterling,
  "circle-user": CircleUser,
  camera: Camera,
  "closed-caption": ClosedCaption,
  "clock-3": Clock3,
  coins: Coins,
  copy: Copy,
  "cloud-sun": CloudSun,
  "drafting-compass": DraftingCompass,
  eclipse: Eclipse,
  "faq-chevron": ChevronDown,
  "faq-chevron-open": ChevronDown,
  file: File,
  "file-code-2": FileCode2,
  "fishing-rod": FishingRod,
  gauge: Gauge,
  "git-branch": GitBranch,
  "hard-drive": HardDrive,
  history: History,
  info: Info,
  image: Image,
  leaf: Leaf,
  "list-checks": ListChecks,
  loader: Loader,
  bubbles: Bubbles,
  "message-circle-question": MessageCircleQuestion,
  minimize: Minimize,
  moon: Moon,
  network: Network,
  "paintbrush-vertical": PaintbrushVertical,
  "panel-left-close": PanelLeftClose,
  "panel-left-open": PanelLeftOpen,
  "pen-tool": PenTool,
  "pencil-line": PencilLine,
  plus: Plus,
  road: Road,
  radio: Radio,
  route: Route,
  save: Save,
  scan: Scan,
  "scan-eye": ScanEye,
  scale: Scale,
  search: Search,
  settings: Settings,
  "shield-check": ShieldCheck,
  "sliders-horizontal": SlidersHorizontal,
  sparkle: Sparkle,
  "square-code": SquareCode,
  target: Target,
  "thumbs-down": ThumbsDown,
  "thumbs-up": ThumbsUp,
  upload: Upload,
  video: Video,
  "volume-1": Volume1,
  "wand-sparkles": WandSparkles,
  "tree-pine": TreePine,
  waypoints: Waypoints,
  x: X,
} satisfies Record<string, LucideIcon>;

export type LumenIconName = keyof typeof ICONS;

function normalizeIconName(name: string): LumenIconName {
  const cleanName = name.replace(/\.svg$/, "");

  if (cleanName.startsWith("arrow-up-right")) {
    return "arrow-up-right";
  }

  if (cleanName in ICONS) {
    return cleanName as LumenIconName;
  }

  throw new Error(`Unsupported Lumen icon: ${name}`);
}

export function LumenIcon({
  className = "",
  name,
  size = 16,
  strokeWidth = 1.5,
}: {
  className?: string;
  name: LumenIconName | string;
  size?: number;
  strokeWidth?: number;
}) {
  const Icon = ICONS[normalizeIconName(name)];

  return (
    <Icon
      aria-hidden="true"
      className={`icon ${className}`.trim()}
      color="currentColor"
      focusable="false"
      size={size}
      strokeWidth={strokeWidth}
    />
  );
}
