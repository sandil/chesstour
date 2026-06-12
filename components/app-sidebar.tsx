"use client";

import {
  Trophy,
  Radio,
  BarChart2,
  BrainCircuit,
  Users,
  HelpCircle,
  LogOut,
  Plus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_MAIN = [
  { label: "Tournaments", icon: Trophy, active: true },
  { label: "Live Games", icon: Radio, active: false },
  { label: "Rankings", icon: BarChart2, active: false },
  { label: "Analysis", icon: BrainCircuit, active: false },
  { label: "Clubs", icon: Users, active: false },
];

const NAV_BOTTOM = [
  { label: "Support", icon: HelpCircle },
  { label: "Log Out", icon: LogOut },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas" className="border-r border-[#334155]">
      {/* Logo + user */}
      <SidebarHeader className="px-5 py-6 gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#4ae176] tracking-tight">
            Grandmaster Elite
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1E293B] border border-[#334155] overflow-hidden shrink-0">
            <div className="w-full h-full flex items-center justify-center text-[#4ae176] font-bold text-sm">
              CA
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-[#dae2fd] truncate">
              Chess Admin
            </p>
            <p className="text-[10px] uppercase tracking-wider text-[#4ae176] font-bold">
              Grandmaster Tier
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="ml-0" />

      {/* Main nav */}
      <SidebarContent className="py-2">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_MAIN.map(({ label, icon: Icon, active }) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton
                    isActive={active}
                    size="default"
                    className={cn(
                      "h-10 px-4 rounded-none text-[13px] font-medium gap-3",
                      active
                        ? "border-l-4 border-[#4ae176] bg-[#1E293B] text-[#4ae176] hover:bg-[#1E293B] hover:text-[#4ae176]"
                        : "text-[#a7b6cc] hover:text-[#dae2fd] hover:bg-[#1E293B]",
                    )}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="gap-0 p-0">
        <div className="px-4 py-4">
          <Button className="w-full bg-white/60 text-[#003915] hover:bg-[#3dd470] font-bold text-[13px] h-10 gap-2 rounded-full">
            <Plus size={15} />
            New Tournament
          </Button>
        </div>

        <SidebarSeparator className="ml-0" />

        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_BOTTOM.map(({ label, icon: Icon }) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton
                    size="default"
                    className="h-10 px-4 rounded-none text-[13px] font-medium gap-3 text-[#a7b6cc] hover:text-[#dae2fd] hover:bg-[#1E293B]"
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
