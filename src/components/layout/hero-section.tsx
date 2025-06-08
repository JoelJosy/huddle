"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/layout/Footer";

const menuItems = [
  { name: "Groups", href: "groups" },
  { name: "Notes", href: "notes" },
  { name: "About", href: "faq" },
];

export default function HeroSection() {
  const [menuState, setMenuState] = useState(false);
  return (
    <>
      <header>
        <nav
          data-state={menuState && "active"}
          className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent"
        >
          <div className="m-auto max-w-5xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
              <div className="flex w-full justify-between lg:w-auto">
                <Link
                  href="/"
                  aria-label="home"
                  className="flex items-center space-x-2"
                >
                  <Image
                    src="/logo_full.svg"
                    alt="Huddle Logo"
                    width={110}
                    height={80}
                    className="dark:hidden"
                  />
                  <Image
                    src="/logo_full_dark.svg"
                    alt="Huddle Logo"
                    width={110}
                    height={80}
                    className="hidden dark:block"
                  />
                </Link>

                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu className="m-auto size-6 duration-200 in-data-[state=active]:scale-0 in-data-[state=active]:rotate-180 in-data-[state=active]:opacity-0" />
                  <X className="absolute inset-0 m-auto size-6 scale-0 -rotate-180 opacity-0 duration-200 in-data-[state=active]:scale-100 in-data-[state=active]:rotate-0 in-data-[state=active]:opacity-100" />
                </button>
              </div>

              <div className="bg-background mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 in-data-[state=active]:block md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:in-data-[state=active]:flex dark:shadow-none dark:lg:bg-transparent">
                <div className="lg:pr-4">
                  <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/login">
                      <span>Login</span>
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/signup">
                      <span>Sign Up</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <div
          aria-hidden
          className="absolute inset-0 isolate z-2 hidden opacity-50 contain-strict lg:block"
        >
          <div className="absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
          <div className="absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>

        <section className="overflow-hidden bg-white dark:bg-transparent">
          <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-24">
            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-6 text-sm">
                ✨ AI-Powered Learning Platform
              </Badge>
              <h1 className="text-4xl font-semibold text-balance md:text-5xl lg:text-6xl">
                Learn Smarter, Study Together
              </h1>
              <p className="mx-auto my-8 max-w-2xl text-xl">
                Create and share study notes, collaborate in study groups, and
                generate AI-powered flashcards. Everything you need to excel in
                your learning journey.
              </p>

              <Button asChild size="lg">
                <Link href="/signup">
                  <span className="btn-label">Start Now</span>
                </Link>
              </Button>
              <Button className="ml-2" variant={"outline"} asChild size="lg">
                <Link href="/faq">
                  <span>Know More</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="mx-auto -mt-16 max-w-7xl">
            <div className="-mr-16 pl-16 perspective-distant lg:-mr-56 lg:pl-56">
              <div className="[transform:rotateX(20deg);]">
                <div className="relative skew-x-[.36rad] lg:h-176">
                  <div
                    aria-hidden
                    className="from-background to-background absolute -inset-16 z-1 bg-linear-to-b via-transparent sm:-inset-32"
                  />
                  <div
                    aria-hidden
                    className="from-background to-background absolute -inset-16 z-1 bg-white/50 bg-linear-to-r via-transparent sm:-inset-32 dark:bg-transparent"
                  />

                  <div
                    aria-hidden
                    className="absolute -inset-16 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] [--color-border:var(--color-zinc-400)] sm:-inset-32 dark:[--color-border:color-mix(in_oklab,var(--color-white)_20%,transparent)]"
                  />
                  <div
                    aria-hidden
                    className="from-background absolute inset-0 z-11 bg-gradient-to-l"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 z-2 size-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,transparent_40%,var(--color-background)_100%)]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 z-2 size-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,transparent_40%,var(--color-background)_100%)]"
                  />

                  <Image
                    className="relative z-1 rounded-(--radius) border"
                    src="https://ocvyaicrbpqrhmkgrlay.supabase.co/storage/v1/object/public/my-images//coverimg.png"
                    alt="Huddle Hero Image"
                    width={2880}
                    height={2074}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
