"use client";

import { type CSSProperties, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "../../components/Button";
import { CompactProductFooter } from "../../components/CompactProductFooter";
import { LogoMark } from "../../components/LogoMark";
import { LumenIcon } from "../../components/LumenIcon";
import { Tag } from "../../components/Tag";
import { Text } from "../../components/Text";
import { useRevealOnView } from "../../hooks/useRevealOnView";
import { getPublicCourseDetail, included, type PublicCourseDetail, type PublicCourseModule } from "../public-course-data";
import styles from "./public-course-detail.module.css";

type ThemeName = "light" | "dark";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function DisplayTitle({
  as: Component = "h1",
  firstWord,
  id,
  remainder,
  className = "",
}: {
  as?: "h1" | "h2";
  firstWord: string;
  id?: string;
  remainder: string;
  className?: string;
}) {
  return (
    <Component aria-label={`${firstWord} ${remainder}`} className={`display-title ${className}`} id={id}>
      <span className="display-title-first">{firstWord}</span>
      <span className="display-title-rest">{remainder}</span>
    </Component>
  );
}

function PublicHeader({ onThemeToggle, theme }: { onThemeToggle: () => void; theme: ThemeName }) {
  const themeToggleLabel = `Switch to ${theme === "light" ? "dark" : "light"} mode`;

  return (
    <header className="marketing-header is-guest">
      <div className="marketing-header-inner">
        <div className="header-left">
          <a className="logo-lockup" href="/" aria-label="MOOCKY home">
            <LogoMark />
          </a>
          <button className="prototype-button prototype-button-ghost" type="button">
            <LumenIcon name="loader" />
            <span>MyProgress</span>
          </button>
        </div>
        <div className="header-actions">
          <button className="prototype-button prototype-button-standalone" onClick={onThemeToggle} type="button" aria-label={themeToggleLabel}>
            <LumenIcon name="eclipse" />
          </button>
          <Button kind="auxiliaryAction" label="Log In" />
          <Button href="/" kind="primaryAction" label="Explore MOOCKY" />
        </div>
      </div>
    </header>
  );
}

function renderHighlightedText(text: string, highlights: string[]) {
  const pattern = new RegExp(`(${highlights.map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");

  return text.split(pattern).map((part, index) =>
    highlights.includes(part) ? <strong key={`${part}-${index}`}>{part}</strong> : <span key={`${part}-${index}`}>{part}</span>,
  );
}

function CoursePromoVisual({ course }: { course: PublicCourseDetail }) {
  return (
    <figure className={styles.coursePromoVisual} id="course-preview" aria-label={`${course.title} course promotional image`}>
      <img alt={course.heroImage.alt} src={course.heroImage.src} />
    </figure>
  );
}

function PurchasePanel() {
  return (
    <aside className={cx(styles.purchasePanel, "reveal-on-view")} aria-label="Course enrollment">
      <div className={styles.priceRow}>
        <strong>$129.00</strong>
        <span>$249.00</span>
      </div>
      <Button className={styles.enrollButton} href="/course" kind="primaryAction" label="Enroll" />
      <Button className={styles.secondaryEnrollButton} kind="auxiliaryAction" label="Add to Favorites" />
      <div className={styles.includedList}>
        <Text as="h2" variant="caption-12" tone="primary">What's included</Text>
        {included.map((item) => (
          <div className={styles.includedItem} key={item.label}>
            <LumenIcon name={item.icon} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function Syllabus({ modules }: { modules: PublicCourseModule[] }) {
  return (
    <section className={cx(styles.section, "reveal-on-view")} aria-labelledby="syllabus-title">
      <div className={styles.sectionHeader}>
        <Text as="h2" id="syllabus-title" variant="label-16" tone="accent">Course Structure</Text>
      </div>
      <div className={styles.syllabusList}>
        {modules.map((module, index) => (
          <article className={`${styles.moduleCard} ${index === 0 ? styles.moduleCardExpanded : ""}`} key={module.id}>
            <div className={styles.moduleSummary}>
              <strong>{module.id}</strong>
              <div>
                <h3>{module.title}</h3>
                <p>{module.meta}</p>
              </div>
              <LumenIcon name="faq-chevron" />
            </div>
            {index === 0 ? (
              <ul className={styles.lessonPreview}>
                {module.lessons.map((lesson) => (
                  <li key={lesson}>{lesson}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function readCourseParam(courseParam: string | string[] | undefined) {
  if (Array.isArray(courseParam)) {
    return courseParam[0];
  }

  return courseParam;
}

export default function PublicCourseDetailPage() {
  const [theme, setTheme] = useState<ThemeName>("light");
  const params = useParams<{ course?: string | string[] }>();
  const course = getPublicCourseDetail(readCourseParam(params.course));
  useRevealOnView();

  return (
    <main className={`prototype-page ${styles.page} theme-${theme}`}>
      <PublicHeader theme={theme} onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")} />

      <div className={styles.shell}>
        <p className={styles.breadcrumb}>Course &gt; {course.category} &gt; {course.title}</p>

        <section className={cx(styles.hero, "reveal-on-view")} aria-labelledby="course-title">
          <div className={styles.heroCopy}>
            <Tag density="default" label={course.category} tone="info" />
            <DisplayTitle className={styles.heroTitle} firstWord={course.titleFirstWord} id="course-title" remainder={course.titleRemainder} />
            <Text as="p" className={styles.heroSubtitle} variant="module-statement-20" tone="muted">
              {course.subtitle}
            </Text>
            <Text className={styles.heroBody} tone="body" variant="body-14">
              {course.body}
            </Text>
            <div className={styles.ratingRow} aria-label={`Course rating ${course.rating.label} from ${course.rating.reviews}`}>
              <span>{course.rating.label}</span>
              <span>{course.rating.reviews}</span>
            </div>
          </div>
          <CoursePromoVisual course={course} />
        </section>

        <div className={styles.detailGrid}>
          <div className={styles.contentColumn}>
            <section className={cx(styles.section, "reveal-on-view")} aria-labelledby="instructor-title">
              <div className={styles.sectionHeader}>
                <Text as="h2" id="instructor-title" variant="label-16" tone="accent">Instructor</Text>
              </div>
              <article className={styles.instructorCard}>
                <div className={styles.instructorAvatar}>{course.instructor.avatar}</div>
                <div className={styles.instructorCopy}>
                  <h3><span>{course.instructor.prefix}</span> {course.instructor.name}</h3>
                  <p>{course.instructor.role}</p>
                  <ul>
                    {course.instructor.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.instructorActions}>
                  <Button kind="auxiliaryAction" label="LinkedIn" />
                  <Button kind="neutralAction" label="Contact" />
                </div>
              </article>
            </section>

            <Syllabus modules={course.modules} />

            <section className={cx(styles.section, "reveal-on-view")} aria-labelledby="outcomes-title">
              <div className={styles.sectionHeader}>
                <Text as="h2" id="outcomes-title" variant="label-16" tone="accent">Learning Outcomes</Text>
              </div>
              <div className={styles.outcomeGrid}>
                {course.outcomes.map((item) => (
                  <article
                    className={styles.outcomeCard}
                    key={item.title}
                    style={{ "--outcome-hover-image": `url(${item.hoverAsset})` } as CSSProperties}
                  >
                    <LumenIcon name={item.icon} />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.copy}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className={cx(styles.aiValueSection, "reveal-on-view")} aria-labelledby="ai-value-title">
              <div className={styles.aiValueCard}>
                <div>
                  <Text as="span" variant="caption-12" tone="accent">AI study companion included</Text>
                  <h2 id="ai-value-title">{course.aiHeading}</h2>
                </div>
                <div className={styles.aiValueGrid}>
                  {course.aiPrompts.map((item) => (
                    <span key={item}>
                      <LumenIcon name="sparkle" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className={cx(styles.aboutSection, "reveal-on-view")} aria-labelledby="about-title">
              <Text as="h2" id="about-title" variant="label-16" tone="accent">{course.about.title}</Text>
              <div className={styles.aboutPanel}>
                {course.about.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{renderHighlightedText(paragraph, course.about.highlights)}</p>
                ))}
              </div>
            </section>

            <section className={cx(styles.testimonialSection, "reveal-on-view")} aria-labelledby="testimonial-title">
              <Text as="h2" id="testimonial-title" variant="label-16" tone="accent">Architect Testimonials</Text>
              <div className={styles.testimonialGrid}>
                {course.testimonials.map((testimonial) => (
                  <article className={styles.testimonialCard} key={testimonial.name}>
                    <p>"{testimonial.quote}"</p>
                    <div>
                      <span>{testimonial.initials}</span>
                      <div>
                        <strong>{testimonial.name}</strong>
                        <em>{testimonial.role}</em>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

          </div>

          <div className={styles.railColumn}>
            <PurchasePanel />
          </div>
        </div>
      </div>

      <CompactProductFooter />
    </main>
  );
}
