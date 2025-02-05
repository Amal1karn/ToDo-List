"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Frame, Bell, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Team", href: "/team" },
  { name: "Reports", href: "/reports" },
];

export function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false }); // Prevent default NextAuth redirect
    router.push("/login"); // Redirect to login page
  };

  return (
    <header className="bg-neutral-100 border-b">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-4">
              <Frame className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">TO-DO</h1>
            </Link>
            <div className="ml-60 hidden space-x-16 lg:block">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-md font-medium transition-colors hover:text-primary",
                    pathname === link.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="ml-10 space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-neutral-200 rounded-full"
            >
              <Bell className="h-6 w-6" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-neutral-200 rounded-full"
                >
                  <User className="h-6 w-6" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-wrap justify-center space-x-6 py-4 lg:hidden">
          {navigation.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
