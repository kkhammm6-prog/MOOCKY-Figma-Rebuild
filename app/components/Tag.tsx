"use client";

import { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { LumenIcon, type LumenIconName } from "./LumenIcon";

export type TagDensity = "default" | "compact" | "line";
export type TagTone = "success" | "info" | "accent" | "neutral";

type SharedTagProps = {
  as?: "span" | "button";
  children?: ReactNode;
  className?: string;
  density?: TagDensity;
  icon?: LumenIconName | false;
  label?: string;
  tone?: TagTone;
};

type AnchorTagProps = SharedTagProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof SharedTagProps> & {
    href: string;
  };

type ButtonTagProps = SharedTagProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SharedTagProps> & {
    as: "button";
    href?: undefined;
  };

type SpanTagProps = SharedTagProps &
  Omit<HTMLAttributes<HTMLSpanElement>, keyof SharedTagProps> & {
    as?: "span";
    href?: undefined;
  };

export type TagProps = AnchorTagProps | ButtonTagProps | SpanTagProps;

function tagClassName(density: TagDensity, tone: TagTone, className?: string) {
  return ["lumen-tag", `lumen-tag-${density}`, `lumen-tag-tone-${tone}`, className].filter(Boolean).join(" ");
}

function TagContent({ children, icon = "arrow-up-right", label }: SharedTagProps) {
  return (
    <>
      <span className="lumen-tag-label">{label ?? children}</span>
      {icon ? (
        <span className="lumen-tag-icon">
          <LumenIcon name={icon} />
        </span>
      ) : null}
    </>
  );
}

export function Tag(props: TagProps) {
  const { as = "span", children, className, density = "default", icon, label, tone = "success", ...rest } = props;
  const classes = tagClassName(density, tone, className);
  const content = <TagContent icon={icon} label={label}>{children}</TagContent>;

  if ("href" in rest && typeof rest.href === "string") {
    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;

    return (
      <a {...anchorProps} className={classes} data-tag-density={density} data-tag-tone={tone}>
        {content}
      </a>
    );
  }

  if (as === "button") {
    const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;

    return (
      <button {...buttonProps} className={classes} data-tag-density={density} data-tag-tone={tone} type={buttonProps.type ?? "button"}>
        {content}
      </button>
    );
  }

  const spanProps = rest as HTMLAttributes<HTMLSpanElement>;

  return (
    <span {...spanProps} className={classes} data-tag-density={density} data-tag-tone={tone}>
      {content}
    </span>
  );
}
