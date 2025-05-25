"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:border-primary/20",
          error:
            "group-[.toast]:bg-destructive group-[.toast]:text-destructive-foreground group-[.toast]:border-destructive/20",
          warning:
            "group-[.toast]:bg-accent group-[.toast]:text-accent-foreground group-[.toast]:border-accent/20",
          info: "group-[.toast]:bg-secondary group-[.toast]:text-secondary-foreground group-[.toast]:border-secondary/20",
        },
      }}
      style={
        {
          "--normal-bg": "hsl(var(--card))",
          "--normal-border": "hsl(var(--border))",
          "--normal-text": "hsl(var(--card-foreground))",
          "--success-bg": "hsl(var(--primary))",
          "--success-border": "hsl(var(--primary))",
          "--success-text": "hsl(var(--primary-foreground))",
          "--error-bg": "hsl(var(--destructive))",
          "--error-border": "hsl(var(--destructive))",
          "--error-text": "hsl(var(--destructive-foreground))",
          "--warning-bg": "hsl(var(--accent))",
          "--warning-border": "hsl(var(--accent))",
          "--warning-text": "hsl(var(--accent-foreground))",
          "--info-bg": "hsl(var(--secondary))",
          "--info-border": "hsl(var(--secondary))",
          "--info-text": "hsl(var(--secondary-foreground))",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
