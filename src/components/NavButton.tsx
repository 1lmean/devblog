import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

const baseClass =
  "inline-flex items-center justify-center rounded-lg border border-none text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100";

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
