import type { Metadata } from "next";
import "@/app/globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Huddle",
  description: "AI powered collaborative study platform ",
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
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
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
