import type { MainNavItem, SidebarNavItem } from "@/types/nav";
import { SquareKanban } from "lucide-react";

export interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Danh sách công việc",
      icon: SquareKanban,
      href: "/task-list"
    },
  ],
  sidebarNav: [
    // {
    //   title: "Getting Started",
    //   items: [
    //     {
    //       title: "Introduction",
    //       href: "/docs",
    //       items: [],
    //     },
    //   ],
    // },
  ],
};
