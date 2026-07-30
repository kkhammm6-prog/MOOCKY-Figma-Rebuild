import type { CSSProperties } from "react";
import { Button } from "../components/Button";
import { LumenIcon, type LumenIconName } from "../components/LumenIcon";
import { LogoMark } from "../components/LogoMark";
import { Tag, type TagTone } from "../components/Tag";
import { ViewportRevealRuntime } from "../components/ViewportRevealRuntime";
import { MyProgressHeader } from "./MyProgressHeader";
import { MyProgressMotionRuntime } from "./MyProgressMotionRuntime";
import styles from "./my-progress.module.css";

/*
 * MYPROGRESS PRODUCT ROUTE
 * Formerly isolated under app/prototypes/my-progress; now connected as a formal
 * authenticated destination at /my-progress.
 */

type Course = {
  title: string;
  provider: string;
  progress: number;
  next: string;
  meta: string;
  image: string;
  state: "current" | "steady" | "risk";
};

type Milestone = {
  kind: string;
  title: string;
  timing: string;
  detail: string;
  tone: TagTone;
};

type SkillSignal = {
  label: string;
  value: number;
  state: string;
};

const courses: Course[] = [
  {
    title: "Neural Architecture",
    provider: "Transformers & Attention",
    progress: 65,
    next: "Transformers & Attention",
    meta: "12/18 lessons complete - last studied 2h ago",
    image: "/assets/figma/recommend-01.png",
    state: "current",
  },
  {
    title: "Data Science for Fintech",
    provider: "Module 2 - Predictive Modeling",
    progress: 28,
    next: "Time-series Feature Lab",
    meta: "4/14 lessons complete - assignment in 3 days",
    image: "/assets/figma/popular-03.png",
    state: "risk",
  },
  {
    title: "Ethics in AI Governance",
    provider: "Module 3 - Global Policy",
    progress: 42,
    next: "Risk Review Workshop",
    meta: "6/14 lessons complete - live class Oct 24",
    image: "/assets/figma/popular-02.png",
    state: "steady",
  },
];

const milestones: Milestone[] = [
  {
    kind: "Exam",
    title: "Neural Networks Midterm",
    timing: "Tomorrow, 09:00",
    detail: "45 min assessment - 20 questions",
    tone: "accent",
  },
  {
    kind: "Assignment",
    title: "Market Analysis Project",
    timing: "In 3 days",
    detail: "Fintech course - Module 2",
    tone: "info",
  },
  {
    kind: "Live Class",
    title: "Ethics in AI: Global Governance",
    timing: "Oct 24, 14:30",
    detail: "Guest lecture - Dr. Sarah Chen",
    tone: "success",
  },
];

const skillSignals: SkillSignal[] = [
  { label: "Logic", value: 92, state: "stable mastery" },
  { label: "Architecture", value: 84, state: "ready to extend" },
  { label: "Statistics", value: 34, state: "needs review" },
];

const aiInsightSignals = [
  {
    label: "Momentum",
    value: "3 concepts",
    detail: "Mastered this week in Neural Architecture",
    icon: "sparkle",
  },
  {
    label: "Risk",
    value: "Statistics",
    detail: "Probability terms caused most quiz misses",
    icon: "target",
  },
  {
    label: "Timing",
    value: "38 min",
    detail: "Enough to review before the midterm",
    icon: "clock-3",
  },
] satisfies { label: string; value: string; detail: string; icon: LumenIconName }[];

const coachActionPanels = [
  {
    href: "#courses",
    icon: "target",
    label: "Review weak skill",
    title: "Statistics recovery sprint",
    detail: "Start with probability terms, then retake the two missed quiz patterns.",
    meta: "18 min focus block",
  },
  {
    href: "#roadmap",
    icon: "bookmark-check",
    label: "Save plan",
    title: "Lock today’s recovery plan",
    detail: "Reserve two short sessions before the neural networks midterm window.",
    meta: "2 sessions left",
  },
] satisfies { href: string; icon: LumenIconName; label: string; title: string; detail: string; meta: string }[];

const stats = [
  { label: "Courses in progress", value: "4", detail: "+1 this month", icon: "book-open-check" },
  { label: "Learning hours", value: "184.5", detail: "18.5 this week", icon: "clock-3" },
  { label: "Weekly goal", value: "82.5%", detail: "2 focused sessions left", icon: "route" },
  { label: "At-risk skill", value: "Statistics", detail: "34% confidence", icon: "brain" },
] satisfies { label: string; value: string; detail: string; icon: LumenIconName }[];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function progressStyle(progress: number) {
  return { "--progress": `${progress}%` } as CSSProperties;
}

function skillStyle(value: number) {
  return { "--skill-progress": `${value}%` } as CSSProperties;
}

type CountAttributes = {
  "data-count-decimals": string;
  "data-count-suffix": string;
  "data-count-value": string;
};

function parseCountValue(value: string) {
  const match = value.match(/^(\d+(?:\.\d+)?)(%)?$/);

  if (!match) {
    return null;
  }

  const [, numericValue, suffix = ""] = match;

  return {
    decimals: numericValue.includes(".") ? numericValue.split(".")[1].length : 0,
    suffix,
    target: numericValue,
  };
}

function countAttributes(value: string): CountAttributes | undefined {
  const count = parseCountValue(value);

  if (!count) {
    return undefined;
  }

  return {
    "data-count-decimals": `${count.decimals}`,
    "data-count-suffix": count.suffix,
    "data-count-value": count.target,
  };
}

function StatPanelDetail({ countPrefix, detail }: { countPrefix: boolean; detail: string }) {
  const match = countPrefix ? detail.match(/^(\d+(?:\.\d+)?%?)(.*)$/) : null;

  if (!match) {
    return <p>{detail}</p>;
  }

  const [, numericPrefix, rest] = match;
  const prefixCountAttributes = countAttributes(numericPrefix);

  return (
    <p>
      <span {...(prefixCountAttributes ?? {})}>{numericPrefix}</span>
      {rest}
    </p>
  );
}

function CompactFooter() {
  return (
    <footer className={styles.productFooter}>
      <div className={styles.productFooterInner}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <a className={styles.footerLogo} href="/" aria-label="MOOCKY home">
              <LogoMark />
            </a>
          </div>

          <nav className={styles.footerLinks} aria-label="Footer">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Help Center</a>
            <a href="#">Careers</a>
          </nav>
        </div>

        <div className={styles.footerBottom}>
          <small>© 2026 MOOCKY. All rights reserved.</small>
          <div className={styles.footerSocials} aria-label="Social links">
            <a href="#">
              <span>Instagram</span>
              <em>@Moocky0428</em>
            </a>
            <a href="#">
              <span>X</span>
              <em>@moockyAI</em>
            </a>
            <a href="#">
              <span>Tiktok</span>
              <em>@Moocky0428</em>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function CourseProgressCard({ course }: { course: Course }) {
  return (
    <article className={cx(styles.courseCard, styles[course.state])}>
      <div className={styles.courseImage}>
        <img src={course.image} alt="" />
      </div>
      <div className={styles.courseBody}>
        <div>
          <p className={styles.courseState}>{course.state === "risk" ? "Needs attention" : course.state === "current" ? "Current focus" : "On track"}</p>
          <h3>{course.title}</h3>
          <p>{course.provider}</p>
        </div>
        <div className={styles.courseProgressRow}>
          <div
            className={styles.progressTrack}
            data-motion-ready="true"
            data-motion-state="idle"
            data-progress-motion
            style={progressStyle(course.progress)}
          >
            <span />
          </div>
          <strong>{course.progress}%</strong>
        </div>
        <div className={styles.courseNextRow}>
          <span>{course.meta}</span>
          <Button href="/course" kind="cardGuideAction" aria-label={`Continue ${course.title}`} />
        </div>
      </div>
    </article>
  );
}

function SkillBubble({ signal }: { signal: SkillSignal }) {
  const value = `${signal.value}%`;

  return (
    <div className={cx(styles.skillBubble, signal.value < 50 && styles.skillBubbleRisk)} style={skillStyle(signal.value)}>
      <div
        className={styles.skillGauge}
        data-motion-ready="true"
        data-motion-state="idle"
        data-ring-motion
        data-ring-value={signal.value}
      >
        <span {...(countAttributes(value) ?? {})}>{value}</span>
      </div>
      <div>
        <strong>{signal.label}</strong>
        <span>{signal.state}</span>
      </div>
    </div>
  );
}

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  return (
    <article className={styles.milestoneCard}>
      <div className={styles.milestoneTop}>
        <Tag density="compact" label={milestone.kind} tone={milestone.tone} />
        <strong>{milestone.timing}</strong>
      </div>
      <h3>{milestone.title}</h3>
      <p>{milestone.detail}</p>
    </article>
  );
}

export default function MyProgressPage() {
  const currentCourse = courses[0];

  return (
    <div className={styles.prototypeRoot}>
      <ViewportRevealRuntime />
      <MyProgressMotionRuntime />
      <input className={styles.themeToggle} id="my-progress-theme-toggle" type="checkbox" />
      <div className={styles.page}>
        <MyProgressHeader />
        <main className={styles.shell}>
          <section className={styles.hero} aria-labelledby="my-progress-title">
            <div className={cx(styles.heroCopy, "reveal-on-view")}>
              <h1 className={styles.displayTitle} id="my-progress-title">
                <span>My</span>
                <span>Progress</span>
              </h1>
              <p className={styles.heroText}>
                A focused workspace for returning learners: resume the next lesson, understand what changed, and see the near-term commitments without landing-page noise.
              </p>
            </div>

            <article className={cx(styles.currentFocusCard, "reveal-on-view")}>
              <div className={styles.focusMedia}>
                <img src="/assets/figma/popular-feature.png" alt="" />
                <div className={styles.focusPill}>
                  <LumenIcon name="book-open-check" />
                  <span>Last studied 2h ago</span>
                </div>
              </div>
              <div className={styles.focusContent}>
                <div>
                  <p className={styles.kicker}>Current focus</p>
                  <h2>Neural Architecture</h2>
                  <p>{currentCourse.next} is the highest-leverage next step before tomorrow's midterm.</p>
                </div>
                <div className={styles.focusProgress} style={progressStyle(currentCourse.progress)}>
                  <div>
                    <span>Course completion</span>
                    <strong>{currentCourse.progress}%</strong>
                  </div>
                  <div
                    className={styles.progressTrack}
                    data-motion-ready="true"
                    data-motion-state="idle"
                    data-progress-motion
                  >
                    <span />
                  </div>
                </div>
                <div className={styles.focusActions}>
                  <Button href="/course" kind="primaryAction" label="Continue learning" />
                  <Button href="#learning-coach" kind="auxiliaryAction" label="Ask Progress Coach" />
                </div>
              </div>
            </article>
          </section>

          <section className={styles.bentoGrid} aria-label="Progress overview">
            <article className={cx(styles.panel, styles.aiInsightsPanel, "reveal-on-view")}>
              <div className={styles.panelHeader}>
                <div>
                  <p className={styles.kicker}>AI insights</p>
                  <h2>Your progress is strong, but one concept is holding the curve.</h2>
                </div>
                <span className={styles.timeChip}>Updated 2h ago</span>
              </div>
              <div className={styles.aiInsightBody}>
                <div className={styles.aiInsightLead}>
                  <div className={styles.aiInsightIcon}>
                    <LumenIcon name="brain" />
                  </div>
                  <div>
                    <strong>AI noticed a split pattern</strong>
                    <p>
                      You are accelerating through architecture lessons, while quiz friction is clustering around statistics vocabulary and probability setup.
                    </p>
                  </div>
                </div>
                <div className={styles.aiInsightSignals}>
                  {aiInsightSignals.map((signal) => (
                    <div className={styles.aiInsightSignal} key={signal.label}>
                      <LumenIcon name={signal.icon} />
                      <span>{signal.label}</span>
                      <strong>{signal.value}</strong>
                      <p>{signal.detail}</p>
                    </div>
                  ))}
                </div>
                <div className={styles.aiInsightEvidence}>
                  <span>Evidence used</span>
                  <p>Recent quiz attempts, lesson completion, saved AI summaries, and tomorrow's midterm deadline.</p>
                </div>
              </div>
            </article>

            <article className={cx(styles.panel, styles.coachPanel, "reveal-on-view")} id="learning-coach">
              <div className={styles.panelHeader}>
                <div>
                  <p className={styles.kicker}>Learning coach</p>
                  <h2>Statistics is the only drag on your trend.</h2>
                </div>
                <LumenIcon name="sparkle" />
              </div>
              <p>
                You are ahead in neural architecture, but recent quiz misses cluster around probability terms. Spend one short session there before adding new material.
              </p>
              <div className={styles.coachActions}>
                {coachActionPanels.map((action) => (
                  <a className={styles.coachActionStrip} href={action.href} key={action.label}>
                    <span className={styles.coachActionIcon}>
                      <LumenIcon name={action.icon} />
                    </span>
                    <span className={styles.coachActionCopy}>
                      <span>{action.label}</span>
                      <strong>{action.title}</strong>
                      <em>{action.detail}</em>
                    </span>
                    <span className={styles.coachActionMeta}>
                      <span>{action.meta}</span>
                      <LumenIcon name="arrow-right" />
                    </span>
                  </a>
                ))}
              </div>
            </article>

            <div className={cx(styles.statPanelGroup, "reveal-on-view")}>
              {stats.map((stat) => {
                const valueCountAttributes = countAttributes(stat.value);

                return (
                  <article className={cx(styles.panel, styles.statPanel)} key={stat.label}>
                    <LumenIcon name={stat.icon} />
                    <span>{stat.label}</span>
                    <strong {...(valueCountAttributes ?? {})}>{stat.value}</strong>
                    <StatPanelDetail countPrefix={!valueCountAttributes} detail={stat.detail} />
                  </article>
                );
              })}
            </div>

            <section className={cx(styles.coursesPanel, "reveal-on-view")} id="courses" aria-labelledby="active-courses-title">
              <div className={styles.coursesHeader}>
                <p className={styles.kicker} id="active-courses-title">
                  Active courses
                </p>
                <a className={styles.coursesTextAction} href="/course">
                  View all
                  <LumenIcon name="arrow-up-right" />
                </a>
              </div>
              <div className={styles.courseList}>
                {courses.map((course) => (
                  <CourseProgressCard course={course} key={course.title} />
                ))}
              </div>
            </section>

            <aside className={cx(styles.panel, styles.insightsPanel, "reveal-on-view")} aria-labelledby="cognitive-insights-title">
              <div className={cx(styles.panelHeader, styles.panelUtilityHeader)}>
                <p className={styles.kicker} id="cognitive-insights-title">
                  Cognitive insights
                </p>
                <span>Updated 2h ago</span>
              </div>
              <div className={styles.skillStack}>
                {skillSignals.map((signal) => (
                  <SkillBubble signal={signal} key={signal.label} />
                ))}
              </div>
              <p className={styles.insightNote}>Scores represent confidence from recent quiz attempts, lesson completion, and AI review prompts.</p>
            </aside>
          </section>

          <section className={cx(styles.roadmapSection, "reveal-on-view")} id="roadmap" aria-labelledby="roadmap-title">
            <div className={styles.roadmapIntro}>
              <p className={styles.kicker}>Upcoming milestones</p>
              <h2 id="roadmap-title">Make urgency visible without making the page anxious.</h2>
              <p>Cards keep equal geometry, but priority is expressed through label tone, copy, and ordering.</p>
            </div>
            <div className={styles.milestoneRail}>
              {milestones.map((milestone) => (
                <MilestoneCard key={milestone.title} milestone={milestone} />
              ))}
            </div>
          </section>
        </main>

        <CompactFooter />
      </div>
    </div>
  );
}
