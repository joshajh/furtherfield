import Link from "next/link";
import { ComponentProps } from "react";

type ButtonProps = {
  variant?: "primary" | "secondary" | "large";
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
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer";

  const variants = {
    primary: "bg-bg-dark text-text-light px-6 py-4 text-xl tracking-tight hover:bg-opacity-80",
    secondary: "bg-transparent border border-text-dark text-text-dark px-6 py-4 text-xl tracking-tight hover:bg-text-dark hover:text-text-light",
    large: "bg-bg-white text-text-dark px-6 py-8 text-7xl md:text-8xl font-serif italic tracking-tight rounded-lg w-full hover:bg-opacity-90",
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
