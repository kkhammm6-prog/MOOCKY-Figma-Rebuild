import { LogoMark } from "./LogoMark";
import styles from "./CompactProductFooter.module.css";

export function CompactProductFooter() {
  return (
    <footer className={styles.compactFooter}>
      <div className={styles.compactFooterInner}>
        <a className={styles.footerLogo} href="/" aria-label="MOOCKY home">
          <LogoMark />
        </a>
        <nav className={styles.footerLinks} aria-label="Course footer">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Help Center</a>
          <a href="#">Accessibility</a>
        </nav>
        <div className={styles.footerSocials}>
          <span>@moockyAI</span>
          <span>Course demo</span>
        </div>
      </div>
    </footer>
  );
}
