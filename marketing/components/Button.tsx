import Link from "next/link";
import { ComponentProps } from "react";

type ButtonProps = {
  variant?: "primary" | "secondary" | "tag" | "large";
  href?: string;
  children: React.ReactNode;
  className?: string;
} & Omit<ComponentProps<"button">, "className">;

export function Button({
  variant = "primary",
  href,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center transition-all duration-200 cursor-pointer";

  const variants = {
    primary: "bg-bg-dark text-text-light px-6 py-4 text-xl tracking-tight font-semibold hover:bg-opacity-80",
    secondary: "tag tag-lg",
    tag: "tag",
    large: "bg-bg-white text-text-dark px-4 sm:px-6 py-6 sm:py-8 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif italic tracking-tight rounded-lg w-full hover:bg-opacity-90",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}
