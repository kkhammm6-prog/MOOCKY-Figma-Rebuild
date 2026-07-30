"use client";

import { FormEvent } from "react";
import { LumenIcon } from "./LumenIcon";
import { Text } from "./Text";

function FooterDisplayTitle() {
  return (
    <h2 className="display-title display-title-size-large">
      <span className="display-title-first">Follow</span>
      <span className="display-title-rest">Where We Are</span>
    </h2>
  );
}

export function SiteFooter() {
  const preventSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-copy">
          <FooterDisplayTitle />
          <Text className="footer-newsletter-copy" tone="muted" variant="body-14">
            Join <strong>MOOCKY</strong> Newsletter & Get weekly insights on learning strategies and exclusive course early-access.
          </Text>
          <form className="newsletter-form" onSubmit={preventSubmit}>
            <label className="sr-only" htmlFor="newsletter-email">
              Email
            </label>
            <input id="newsletter-email" placeholder="Enter your email" type="email" />
            <button type="submit">
              Subscribe
              <LumenIcon name="arrow-up-right" />
            </button>
          </form>
          <small>&copy; 2026 MOOCKY. All rights reserved.</small>
        </div>
        <nav className="footer-links" aria-label="Footer">
          {["Privacy Policy", "Terms of Service", "Help Center", "Careers"].map((link) => (
            <a href="#" key={link}>
              {link}
            </a>
          ))}
        </nav>
      </div>
      <div className="footer-socials">
        <a href="#">
          <span>Instagram</span>
          <em>@Moocky0428</em>
        </a>
        <a href="#">
          <span>X</span>
          <em>@moockyAI</em>
        </a>
        <a href="#">
          <strong>New</strong>
          <span>Tiktok</span>
          <em>@Moocky0428</em>
        </a>
      </div>
    </footer>
  );
}
