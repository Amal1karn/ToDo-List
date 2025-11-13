"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Users, BarChart3 } from "lucide-react";

import { cn } from "@/lib/utils";
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
  { name: "Reports", href: "/todo_report", icon: BarChart3 },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <div className="flex h-screen w-32 flex-col items-center space-y-8 border-r border-[#7f5af0]/40 bg-gradient-to-b from-[#12142b] to-[#1a1a2e] py-4">
        <nav className="flex flex-1 flex-col items-center space-y-16 justify-center">
          {navigation.map((item) => (
            <Tooltip key={item.name} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-center p-4 text-sm font-medium rounded-full transition-all duration-300",
                    pathname === item.href
                      ? "bg-[#7f5af0]/50 text-[#e0e0f8] shadow-[0_0_15px_rgba(127,90,240,0.7)]"
                      : "text-[#c0c0ff] hover:bg-[#7f5af0]/20 hover:text-[#7f5af0] hover:shadow-[0_0_10px_rgba(127,90,240,0.5)]"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-[#1a1a2e] text-[#c0c0ff] border border-[#7f5af0]/40 shadow-lg"
              >
                {item.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </div>
    </TooltipProvider>
  );
}
