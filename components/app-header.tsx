"use client";

import { Bell, Settings, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function AppHeader() {
  return (
    <header className="h-14 bg-[#171f33] border-b border-[#334155] flex items-center gap-3 px-4 sticky top-0 z-40">
      <SidebarTrigger className="text-[#a7b6cc] hover:text-[#dae2fd] hover:bg-[#1E293B] shrink-0" />

      <Separator orientation="vertical" className="h-full bg-[#334155]" />

      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a7b6cc] pointer-events-none"
        />
        <Input
          placeholder="Search tournaments, players..."
          className="pl-8 h-8 bg-[#1E293B] border-[#334155] text-[#dae2fd] placeholder:text-[#a7b6cc] focus-visible:border-[#4ae176] focus-visible:ring-[#4ae176]/20 rounded-full text-[13px]"
        />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-[#a7b6cc] hover:text-[#dae2fd] hover:bg-[#1E293B] h-8 w-8"
        >
          <Bell size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-[#a7b6cc] hover:text-[#dae2fd] hover:bg-[#1E293B] h-8 w-8"
        >
          <Settings size={16} />
        </Button>

        <div className="ml-1 w-7 h-7 rounded-full bg-[#1E293B] border border-[#4ae176]/20 flex items-center justify-center text-[#4ae176] font-bold text-[11px] shrink-0">
          CA
        </div>
      </div>
    </header>
  );
}
