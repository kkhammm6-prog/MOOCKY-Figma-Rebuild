import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Button } from "../components/Button";
import { LogoMark } from "../components/LogoMark";
import { LumenIcon } from "../components/LumenIcon";
import { SiteFooter } from "../components/SiteFooter";
import { Text } from "../components/Text";
import { ViewportRevealRuntime } from "../components/ViewportRevealRuntime";
import styles from "./redeem.module.css";

export const metadata: Metadata = {
  title: "MOOCKY Rewards",
  description: "Redeem MOOCKY learning points for physical rewards, digital boosts, and learning rituals.",
};

const merchRewards = [
  {
    title: "Studio Kit",
    eyebrow: "Limited drop",
    points: "2,400 pts",
    image: "/assets/redeem/studio-kit.png",
    alt: "MOOCKY study desk kit with notebook, mug, card, and desk mat",
    copy: "A desk ritual set for learners who keep showing up.",
  },
  {
    title: "Learning Hoodie",
    eyebrow: "Soft goods",
    points: "1,800 pts",
    image: "/assets/redeem/hoodie.png",
    alt: "MOOCKY neutral learning hoodie product image",
    copy: "Heavyweight cotton with a quiet mark and generous fit.",
  },
  {
    title: "Study Kit",
    eyebrow: "Stationery",
    points: "950 pts",
    image: "/assets/redeem/study-kit.png",
    alt: "MOOCKY notebook, pen, and sticker study kit",
    copy: "Notebook, pen, and sticker sheet for course notes.",
  },
  {
    title: "Tote + Pins",
    eyebrow: "Campus carry",
    points: "1,250 pts",
    image: "/assets/redeem/tote-pins.png",
    alt: "MOOCKY tote bag and enamel pin reward set",
    copy: "Canvas tote and enamel pins for daily learning carry.",
  },
];

const digitalRewards = [
  {
    title: "AI Lab Pro",
    copy: "7 days of priority models and compute queues.",
    points: "1,200 pts",
    image: "/assets/redeem/lab-pass.png",
    alt: "Premium AI Lab Pro access pass cards on warm paper",
  },
  {
    title: "Masterclass Seat",
    copy: "A live advanced NLP session with the research team.",
    points: "850 pts",
    image: "/assets/redeem/masterclass-seat.png",
    alt: "Premium masterclass invitation and ticket stationery",
  },
  {
    title: "Course Credit",
    copy: "Apply a learning credit toward your next certificate.",
    points: "650 pts",
    image: "/assets/redeem/course-credit.png",
    alt: "Premium course credit voucher and token stationery",
  },
];

const ritualStrips = [
  {
    title: "Desk Rituals",
    copy: "Planning pages, focus prompts, and analog cues that make returning to study feel intentional.",
    image: "/assets/redeem/ritual-desk.png",
    hoverImage: "/assets/redeem/hover-mesh-gradient-11.png",
    alt: "Editorial desk ritual still life with planning pages, pencil, cards, and warm ceramic cup",
    action: "Build a ritual",
    href: "#drops",
  },
  {
    title: "Soft Goods",
    copy: "Material-led rewards for learners who want the habit to travel beyond the screen.",
    image: "/assets/redeem/ritual-soft.png",
    hoverImage: "/assets/redeem/hover-mesh-gradient-12.png",
    alt: "Neutral fabric textures, tote strap, thread samples, and soft goods details",
    action: "Browse soft goods",
    href: "#drops",
  },
  {
    title: "AI Access",
    copy: "Priority compute moments, lab passes, and guided boosts for deeper experimental weeks.",
    image: "/assets/redeem/ritual-ai.png",
    hoverImage: "/assets/redeem/hover-mesh-gradient-13.png",
    alt: "Translucent access tokens with embossed circuit lines and muted spectral tabs",
    action: "View access",
    href: "#digital",
  },
];

const milestones = [
  ["Cognitive Architect", "2,450 pts", "Current balance"],
  ["Deep Thinker", "550 pts", "Unlock member-only drops"],
  ["Studio Fellow", "1,950 pts", "Early access to physical rewards"],
];

function DisplayTitle({
  as: Component = "h1",
  firstWord,
  remainder,
  className = "",
}: {
  as?: "div" | "h1" | "h2";
  firstWord: string;
  remainder: string;
  className?: string;
}) {
  return (
    <Component className={`display-title ${className}`}>
      <span className="display-title-first">{firstWord}</span>
      <span className="display-title-rest">{remainder}</span>
    </Component>
  );
}

function RedeemHeader() {
  return (
    <header className={styles.header}>
      <a aria-label="MOOCKY home" className={styles.logoLink} href="/">
        <LogoMark />
      </a>
      <nav aria-label="Rewards navigation" className={styles.nav}>
        <a href="#drops">Drops</a>
        <a href="#digital">Digital Boosts</a>
        <a href="#history">History</a>
      </nav>
      <div className={styles.headerActions}>
        <span className={styles.balancePill}>
          <LumenIcon name="coins" />
          2,450 pts
        </span>
        <Button href="#drops" kind="neutralAction" label="Browse Rewards" />
      </div>
    </header>
  );
}

function RewardImage({ reward, priority = false }: { reward: (typeof merchRewards)[number]; priority?: boolean }) {
  return <img alt={reward.alt} className={styles.rewardImage} fetchPriority={priority ? "high" : "auto"} loading="eager" src={reward.image} />;
}

export default function RedeemPage() {
  const [studioReward, hoodieReward, studyReward, toteReward] = merchRewards;

  return (
    <main className={`prototype-page ${styles.page}`}>
      <ViewportRevealRuntime />
      <RedeemHeader />

      <section className={`${styles.hero} reveal-on-view`}>
        <div className={styles.heroCopy}>
          <Text as="p" className={styles.kicker} tone="muted" variant="label-16">
            MOOCKY Rewards
          </Text>
          <DisplayTitle className={styles.heroTitle} firstWord="Redeem" remainder="Your Learning" />
          <Text className={styles.heroBody} tone="body" variant="body-14">
            Turn steady study into useful objects, creator tools, and small rituals that make the next lesson easier to begin.
          </Text>
          <div className={styles.heroActions}>
            <Button href="#drops" kind="primaryAction" label="View the Drop" />
            <Button href="#history" kind="auxiliaryAction" label="See Statement" />
          </div>
        </div>

        <div className={styles.heroGallery} aria-label="Featured reward imagery">
          <div className={`${styles.heroImageFrame} ${styles.heroImageFramePrimary}`}>
            <RewardImage priority reward={studioReward} />
          </div>
          <div className={`${styles.heroImageFrame} ${styles.heroImageFrameSecondary}`}>
            <RewardImage reward={hoodieReward} />
          </div>
          <div className={styles.creditPanel}>
            <span>Cognitive Credits</span>
            <strong>2,450</strong>
            <small>550 pts until Deep Thinker</small>
          </div>
        </div>
      </section>

      <section className={`${styles.statementBand} reveal-on-view`} aria-label="Reward promise">
        <Text as="p" tone="primary" variant="module-statement-20">
          Rewards should feel earned, tangible, and calm. The redeem experience moves redemption away from a compact account panel and into a discovery-led store.
        </Text>
        <div className={styles.statementMetric}>
          <span>Next unlock</span>
          <strong>Deep Thinker</strong>
        </div>
      </section>

      <section className={`${styles.section} reveal-on-view`} id="drops" aria-labelledby="drop-title">
        <div className={styles.sectionIntro}>
          <Text as="h2" id="drop-title" tone="muted" variant="label-16">
            Featured Reward Drop
          </Text>
          <Text tone="body" variant="body-14">
            Physical rewards lead the page. Digital bonuses remain available, but they no longer carry the whole story.
          </Text>
        </div>

        <div className={styles.bentoGrid}>
          <article className={`${styles.rewardCard} ${styles.rewardCardLarge}`}>
            <RewardImage priority reward={studioReward} />
            <div className={styles.rewardCardCopy}>
              <Text as="p" tone="accent" variant="caption-12">
                {studioReward.eyebrow}
              </Text>
              <Text as="h3" tone="primary" variant="module-title-24">
                {studioReward.title}
              </Text>
              <Text tone="body" variant="body-14">
                {studioReward.copy}
              </Text>
              <div className={styles.rewardCardFooter}>
                <strong>{studioReward.points}</strong>
                <Button kind="neutralAction" label="Redeem Now" />
              </div>
            </div>
          </article>

          {[hoodieReward, studyReward].map((reward) => (
            <article className={styles.rewardCard} key={reward.title}>
              <RewardImage reward={reward} />
              <div className={styles.rewardCardCopy}>
                <Text as="p" tone="accent" variant="caption-12">
                  {reward.eyebrow}
                </Text>
                <Text as="h3" tone="primary" variant="module-title-20">
                  {reward.title}
                </Text>
                <Text tone="body" variant="body-12">
                  {reward.copy}
                </Text>
                <div className={styles.rewardCardFooter}>
                  <strong>{reward.points}</strong>
                  <Button kind="cardGuideAction" aria-label={`Redeem ${reward.title}`} />
                </div>
              </div>
            </article>
          ))}

          <article className={`${styles.rewardCard} ${styles.rewardCardWide}`}>
            <RewardImage reward={toteReward} />
            <div className={styles.rewardCardCopy}>
              <Text as="p" tone="accent" variant="caption-12">
                {toteReward.eyebrow}
              </Text>
              <Text as="h3" tone="primary" variant="module-title-20">
                {toteReward.title}
              </Text>
              <Text tone="body" variant="body-14">
                {toteReward.copy}
              </Text>
              <div className={styles.rewardCardFooter}>
                <strong>{toteReward.points}</strong>
                <Button kind="neutralAction" label="Add to Claim" />
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className={`${styles.section} reveal-on-view`} id="digital" aria-labelledby="digital-title">
        <div className={styles.splitIntro}>
          <div>
            <Text as="h2" id="digital-title" tone="muted" variant="label-16">
              Digital Boosts
            </Text>
            <DisplayTitle as="div" className="display-title-size-medium" firstWord="Useful" remainder="Not Noisy" />
          </div>
          <Text tone="body" variant="body-14">
            Credits, seats, and access still matter. They just work better as compact boosts below the more memorable reward drop.
          </Text>
        </div>

        <div className={styles.digitalShowcase}>
          {digitalRewards.map((reward) => (
            <article className={styles.digitalItem} key={reward.title}>
              <img alt={reward.alt} loading="eager" src={reward.image} />
              <div className={styles.digitalItemCopy}>
                <div>
                  <Text as="h3" tone="primary" variant="module-title-20">
                    {reward.title}
                  </Text>
                  <Text tone="body" variant="body-12">
                    {reward.copy}
                  </Text>
                </div>
                <span>{reward.points}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.accordionSection} reveal-on-view`} aria-labelledby="curated-title">
        <div className={styles.sectionIntro}>
          <Text as="h2" id="curated-title" tone="muted" variant="label-16">
            Curated by Ritual
          </Text>
          <Text tone="body" variant="body-14">
            Browse by the kind of support a learner wants after a week of focused progress.
          </Text>
        </div>
        <div className={styles.ritualStripList}>
          {ritualStrips.map((ritual) => (
            <article
              className={styles.ritualStrip}
              key={ritual.title}
              style={{ "--ritual-hover-image": `url(${ritual.hoverImage})` } as CSSProperties}
            >
              <div className={styles.ritualStripImage}>
                <img alt={ritual.alt} loading="eager" src={ritual.image} />
              </div>
              <div className={styles.ritualStripPanel}>
                <div>
                  <Text as="h3" tone="primary" variant="module-title-24">
                    {ritual.title}
                  </Text>
                  <Text tone="body" variant="body-14">
                    {ritual.copy}
                  </Text>
                </div>
                <a aria-label={`${ritual.action}: ${ritual.title}`} className={styles.ritualStripAction} href={ritual.href}>
                  {ritual.action}
                  <LumenIcon name="arrow-up-right" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} reveal-on-view`} aria-labelledby="milestone-title">
        <div className={styles.milestoneShell}>
          <div className={styles.milestoneIntro}>
            <Text as="h2" id="milestone-title" tone="muted" variant="label-16">
              Milestone Path
            </Text>
            <Text as="p" tone="primary" variant="module-statement-20">
              Show learners what their points can become before asking them to spend.
            </Text>
          </div>
          <div className={styles.milestoneTrack}>
            {milestones.map(([title, value, copy], index) => (
              <article className={styles.milestoneItem} key={title}>
                <span>{index + 1}</span>
                <Text as="h3" tone="primary" variant="module-title-20">
                  {title}
                </Text>
                <strong>{value}</strong>
                <Text tone="body" variant="body-12">
                  {copy}
                </Text>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.historySection} reveal-on-view`} id="history" aria-labelledby="history-title">
        <div className={styles.sectionIntro}>
          <Text as="h2" id="history-title" tone="muted" variant="label-16">
            Redemption History
          </Text>
          <Text tone="body" variant="body-14">
            Account details stay available, but the visual priority belongs to discovering the next reward.
          </Text>
        </div>
        <div className={styles.historyTable}>
          {[
            ["Neural Art Generator Credits", "Apr 18, 2026", "400 pts", "Redeemed"],
            ["Python for Data Science Plus", "Apr 09, 2026", "1,500 pts", "Active"],
            ["Alpha Community Badge", "Mar 30, 2026", "250 pts", "Redeemed"],
          ].map(([name, date, cost, status]) => (
            <div className={styles.historyRow} key={name}>
              <strong>{name}</strong>
              <span>{date}</span>
              <span>{cost}</span>
              <em>{status}</em>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
