import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

const baseClass =
  "inline-flex items-center justify-center text-muted transition-colors hover:text-foreground";

type NavLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  as?: "link";
};

type NavAnchorProps = ComponentPropsWithoutRef<"a"> & {
  as: "a";
  href: string;
};

type NavButtonElementProps = ComponentPropsWithoutRef<"button"> & {
  as: "button";
};

type NavButtonProps = NavLinkProps | NavAnchorProps | NavButtonElementProps;

export function NavButton(props: NavButtonProps) {
  if (props.as === "button") {
    const { as: _, className, ...rest } = props;
    return (
      <button
        type="button"
        className={[baseClass, className].filter(Boolean).join(" ")}
        {...rest}
      />
    );
  }

  if (props.as === "a") {
    const { as: _, className, ...rest } = props;
    return (
      <a
        className={[baseClass, className].filter(Boolean).join(" ")}
        {...rest}
      />
    );
  }

  const { as: _, className, ...rest } = props;
  return (
    <Link
      className={[baseClass, className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}
