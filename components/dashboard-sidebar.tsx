"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Frame,
  LayoutDashboard,
  FolderKanban,
  Users,
  BarChart3,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/", icon: FolderKanban },
  { name: "Team", href: "/", icon: Users },
  { name: "Reports", href: "/", icon: BarChart3 },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <div className="flex h-screen w-32 flex-col items-center  space-y-8 border-r bg-background py-4 ">
        <nav className="flex flex-1 flex-col items-center space-y-16 justify-center">
          {navigation.map((item) => (
            <Tooltip key={item.name} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-center  p-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground hover:bg-neutral-200 rounded-full",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.name}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </div>
    </TooltipProvider>
  );
}
