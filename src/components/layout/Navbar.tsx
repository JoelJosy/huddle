import Link from "next/link";
import { Book, Boxes, Menu, Sunset, Trees, Zap } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

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

const Navbar = async ({
  menu = [
    { title: "Home", url: "#" },
    {
      title: "Groups",
      url: "#",
      items: [
        {
          title: "Create Group",
          description: "Start a new group to collaborate with others",
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "View Groups",
          description: "Explore existing groups and join discussions",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Rules & Guidelines",
          description: "Understand the rules for group participation",
          icon: <Sunset className="size-5 shrink-0" />,
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
          icon: <Book className="size-5 shrink-0" />,
          url: "/notes",
        },
        {
          title: "Create Note",
          description: "We are here to help you with any questions you have",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "/notes/create",
        },
        {
          title: "My Notes",
          description: "Check the current status of our services and APIs",
          icon: <Trees className="size-5 shrink-0" />,
          url: "/notes/my-notes",
        },
      ],
    },
    {
      title: "FAQ",
      url: "#",
    },
  ],
  auth = {
    login: { title: "Login", url: "#" },
    signup: { title: "Sign up", url: "#" },
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
              <Boxes className="size-8" />
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
                <span className="text-sm">
                  Welcome, {user.user_metadata.name || "User"}!
                </span>
                <SignOutButton />
              </div>
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
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={"/dashboard"} className="flex items-center gap-2">
              <Boxes className="size-8" />
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
                      <Boxes className="size-8" />
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

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <Link href={subItem.url} passHref>
                {" "}
                {/* Use Link here */}
                <SubMenuLink item={subItem} />
              </Link>
            </NavigationMenuLink>
          ))}
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
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <Link key={subItem.title} href={subItem.url} passHref>
              {" "}
              {/* Use Link here */}
              <SubMenuLink item={subItem} />
            </Link>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="hover:bg-muted hover:text-accent-foreground flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-muted-foreground text-sm leading-snug">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar };
