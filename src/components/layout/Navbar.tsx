import type React from "react";
import Link from "next/link";
import {
  BookOpen,
  Menu,
  FileText,
  Users,
  UserPlus,
  Settings,
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SignOutButton } from "../auth/SignOutButton";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground min-w-[300px] rounded-xl p-4 shadow-md">
          <div className="flex flex-col gap-2">
            {item.items.map((subItem) => (
              <NavigationMenuLink key={subItem.title} asChild>
                <Link
                  href={subItem.url}
                  className="hover:bg-muted hover:text-accent-foreground flex items-start gap-3 rounded-xl p-3 transition-colors"
                >
                  <div className="text-muted-foreground pt-1">
                    {subItem.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm leading-none font-medium">
                      {subItem.title}
                    </p>
                    {subItem.description && (
                      <p className="text-muted-foreground text-sm leading-snug">
                        {subItem.description}
                      </p>
                    )}
                  </div>
                </Link>
              </NavigationMenuLink>
            ))}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group bg-background hover:bg-muted hover:text-accent-foreground inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2 flex flex-col gap-2">
          {item.items.map((subItem) => (
            <Link
              key={subItem.title}
              href={subItem.url}
              className="hover:bg-muted hover:text-accent-foreground flex items-start gap-3 rounded-md p-3 transition-colors"
            >
              <div className="text-muted-foreground pt-1">{subItem.icon}</div>
              <div className="space-y-1">
                <p className="text-sm leading-none font-medium">
                  {subItem.title}
                </p>
                {subItem.description && (
                  <p className="text-muted-foreground text-sm leading-snug">
                    {subItem.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </Link>
  );
};

const Navbar = async ({
  menu = [
    { title: "Home", url: "/dashboard" },
    {
      title: "Groups",
      url: "/groups",
      items: [
        {
          title: "Create Group",
          description: "Start a new group to collaborate with others",
          icon: <UserPlus className="size-5 shrink-0" />,
          url: "/groups",
        },
        {
          title: "View Groups",
          description: "Explore existing groups and join discussions",
          icon: <Users className="size-5 shrink-0" />,
          url: "/groups",
        },
        {
          title: "Rules & Guidelines",
          description: "Understand the rules for group participation",
          icon: <Settings className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: "Notes",
      url: "/notes",
      items: [
        {
          title: "Browse Public Notes",
          description: "Explore notes shared by our community",
          icon: <BookOpen className="size-5 shrink-0" />,
          url: "/notes",
        },
        {
          title: "Create Note",
          description: "Create a new note to share with the community",
          icon: <FileText className="size-5 shrink-0" />,
          url: "/notes/create",
        },
        {
          title: "My Notes",
          description: "View and manage your personal notes",
          icon: <BookOpen className="size-5 shrink-0" />,
          url: "/notes/my-notes",
        },
      ],
    },
    { title: "Learn", url: "/smart" },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/signup" },
  },
}: NavbarProps) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <section className="my-2 flex w-full justify-center py-2">
      <div className="container min-w-full px-8">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href={"/dashboard"} className="flex items-center gap-2">
              <Image
                src="/logo_full.svg"
                alt="Huddle Logo"
                width={110}
                height={80}
                className="h-7 w-auto dark:hidden"
              />
              <Image
                src="/logo_full_dark.svg"
                alt="Huddle Logo"
                width={110}
                height={80}
                className="hidden h-8 w-auto dark:block"
              />
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
            {user ? (
              // Show user menu when logged in
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <span className="text-sm">
                  Welcome, {user.user_metadata.name || "User"}!
                </span>
                <SignOutButton />
              </div>
            ) : (
              // Show login/signup when not logged in
              <>
                <ThemeToggle />
                <Button asChild variant="outline">
                  <Link href={auth.login.url}>Login</Link>
                </Button>
                <Button asChild>
                  <Link href={auth.signup.url}>Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={"/dashboard"} className="flex items-center gap-2">
              <Image
                src="/logo_full.svg"
                alt="Huddle Logo"
                width={100}
                height={50}
                className="h-7 w-auto dark:hidden"
              />
              <Image
                src="/logo_full_dark.svg"
                alt="Huddle Logo"
                width={110}
                height={80}
                className="hidden h-8 w-auto dark:block"
              />
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      href={"/dashboard"}
                      className="flex items-center gap-2"
                    >
                      <Image
                        src="/logo_full.svg"
                        alt="Huddle Logo"
                        width={100}
                        height={50}
                        className="h-7 w-auto dark:hidden"
                      />
                      <Image
                        src="/logo_full_dark.svg"
                        alt="Huddle Logo"
                        width={110}
                        height={80}
                        className="hidden h-8 w-auto dark:block"
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-4">
                    <ThemeToggle />
                    {user ? (
                      // Show user menu when logged in
                      <SignOutButton />
                    ) : (
                      // Show login/signup when not logged in
                      <>
                        <Button asChild variant="outline">
                          <Link href={auth.login.url}>Login</Link>
                        </Button>
                        <Button asChild>
                          <Link href={auth.signup.url}>Sign up</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Navbar };
