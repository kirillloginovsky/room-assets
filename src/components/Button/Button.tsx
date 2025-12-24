import { type ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
}

export function Button({ children, variant = "primary", onClick, className }: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`${variant === 'primary' ? 'primary-btn' : 'secondary-btn'} ${className || ''}`}
    >
      {children}
    </button>
  );
}