import type { Metadata } from "next";
import "@/app/globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Huddle",
  description: "AI powered collaborative study platform",
  icons: {
    icon: "/logo1.svg",
    shortcut: "/logo1.svg",
    apple: "/logo1.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background min-h-screen font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-center"
            expand={true}
            richColors
            toastOptions={{
              duration: 4000,
              style: {
                fontSize: "16px",
                padding: "16px 20px",
                minHeight: "60px",
                minWidth: "400px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
