import { ElementType, HTMLAttributes, ReactNode } from "react";

export type TextVariant =
  | "body-14"
  | "body-12"
  | "label-16"
  | "button-12"
  | "chip-14"
  | "caption-12"
  | "module-title-16"
  | "module-title-20"
  | "module-title-24"
  | "module-title-40-italic"
  | "module-statement-20"
  | "serif-caption-12-italic";

export type TextTone = "primary" | "body" | "muted" | "soft" | "accent" | "inverse" | "ai" | "inherit";

export type TextProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
  tone?: TextTone;
  variant?: TextVariant;
};

export function Text({ as: Component = "p", children, className = "", tone = "body", variant = "body-14", ...props }: TextProps) {
  return (
    <Component className={`moocky-text moocky-text-${variant} moocky-text-tone-${tone} ${className}`} {...props}>
      {children}
    </Component>
  );
}
