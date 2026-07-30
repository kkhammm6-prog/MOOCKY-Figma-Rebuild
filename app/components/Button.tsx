"use client";

import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { LumenIcon, type LumenIconName } from "./LumenIcon";

export type ButtonKind = "standaloneIcon" | "auxiliaryAction" | "primaryAction" | "neutralAction" | "cardGuideAction" | "aiChatFunctionChip" | "floatingResume" | "searchPrompt";
export type ButtonTheme = "light" | "dark";

type SharedButtonProps = {
  children?: ReactNode;
  className?: string;
  icon?: LumenIconName;
  kind?: ButtonKind;
  label?: string;
  theme?: ButtonTheme;
};

type NativeButtonProps = SharedButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SharedButtonProps> & {
    href?: undefined;
  };

type AnchorButtonProps = SharedButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof SharedButtonProps> & {
    href: string;
  };

export type ButtonProps = NativeButtonProps | AnchorButtonProps;

const ACTION_ICON_KINDS = new Set<ButtonKind>(["auxiliaryAction", "primaryAction", "neutralAction"]);

function buttonClassName(kind: ButtonKind, className?: string) {
  return ["lumen-button", `lumen-button-${kind}`, className].filter(Boolean).join(" ");
}

function ButtonContent({ children, icon, kind, label }: SharedButtonProps & { kind: ButtonKind }) {
  return (
    <>
      {icon ? (
        <span className="lumen-button-icon lumen-button-icon-leading">
          <LumenIcon name={icon} />
        </span>
      ) : null}
      {label ? <span className="lumen-button-label">{label}</span> : children}
      {ACTION_ICON_KINDS.has(kind) ? (
        <LumenIcon className="lumen-button-icon lumen-button-action-icon" name="arrow-up-right" />
      ) : null}
      {kind === "cardGuideAction" ? (
        <LumenIcon className="lumen-button-icon lumen-button-action-icon" name="arrow-right" />
      ) : null}
    </>
  );
}

export function Button(props: ButtonProps) {
  const { children, className, icon, kind = "neutralAction", label, theme, ...rest } = props;
  const classes = buttonClassName(kind, className);
  const content = <ButtonContent icon={icon} kind={kind} label={label}>{children}</ButtonContent>;

  if ("href" in rest && typeof rest.href === "string") {
    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;

    return (
      <a {...anchorProps} className={classes} data-button-theme={theme}>
        {content}
      </a>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button {...buttonProps} className={classes} data-button-theme={theme} type={buttonProps.type ?? "button"}>
      {content}
    </button>
  );
}
