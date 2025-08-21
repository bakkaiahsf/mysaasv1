"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Search,
  Building2,
  Users,
  TrendingUp,
  FileText,
  Bookmark,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronDown,
  Zap,
  MapPin,
  Network,
  AlertTriangle,
} from "lucide-react";

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    description: "Overview and analytics",
  },
  {
    title: "Company Intelligence",
    href: "/dashboard/search",
    icon: Search,
    description: "Search and analyze companies",
    children: [
      {
        title: "Advanced Search",
        href: "/dashboard/search",
        icon: Search,
        description: "Multi-criteria company search",
      },
      {
        title: "Company Profiles",
        href: "/dashboard/companies",
        icon: Building2,
        description: "Detailed company information",
      },
      {
        title: "Compare Companies",
        href: "/dashboard/compare",
        icon: TrendingUp,
        description: "Side-by-side analysis",
      },
    ],
  },
  {
    title: "Analytics & Insights",
    href: "/dashboard/analytics",
    icon: BarChart3,
    description: "Business intelligence tools",
    children: [
      {
        title: "Market Trends",
        href: "/dashboard/market-trends",
        icon: TrendingUp,
        description: "Industry trend analysis",
      },
      {
        title: "Risk Assessment",
        href: "/dashboard/risk-assessment",
        icon: AlertTriangle,
        description: "Company risk evaluation",
      },
      {
        title: "Network Analysis",
        href: "/dashboard/network-analysis",
        icon: Network,
        description: "Business network mapping",
      },
      {
        title: "Geographic Insights",
        href: "/dashboard/geographic-insights",
        icon: MapPin,
        description: "Location-based analysis",
      },
    ],
  },
  {
    title: "Reports & Documents",
    href: "/dashboard/reports",
    icon: FileText,
    description: "Generated reports and exports",
    children: [
      {
        title: "Saved Reports",
        href: "/dashboard/saved-reports",
        icon: FileText,
        description: "Your generated reports",
      },
      {
        title: "Templates",
        href: "/dashboard/templates",
        icon: FileText,
        description: "Report templates",
      },
    ],
  },
  {
    title: "Saved & Bookmarks",
    href: "/dashboard/bookmarks",
    icon: Bookmark,
    description: "Saved companies and searches",
  },
  {
    title: "Team & Collaboration",
    href: "/dashboard/team",
    icon: Users,
    description: "Team management",
    badge: "Pro",
  },
];

const bottomNavigationItems: NavigationItem[] = [
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Account and preferences",
  },
  {
    title: "Help & Support",
    href: "/dashboard/help",
    icon: HelpCircle,
    description: "Documentation and support",
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const NavigationLink = ({ item, level = 0 }: { item: NavigationItem; level?: number }) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
    const isExpanded = expandedItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div className="space-y-1">
        <div
          className={cn(
            "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            level > 0 && "ml-6 border-l border-sidebar-border pl-4",
            isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.title)}
              className="flex w-full items-center gap-3 text-left"
            >
              <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-sidebar-primary")} />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                </>
              )}
            </button>
          ) : (
            <Link href={item.href} className="flex w-full items-center gap-3">
              <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-sidebar-primary")} />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          )}

          {/* Tooltip for collapsed state */}
          {collapsed && (
            <div className="absolute left-full top-1/2 z-50 ml-2 hidden -translate-y-1/2 rounded-md bg-sidebar-popover px-2 py-1 text-xs text-sidebar-popover-foreground shadow-lg group-hover:block">
              {item.title}
              {item.description && (
                <div className="text-xs text-muted-foreground">{item.description}</div>
              )}
            </div>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && !collapsed && (
          <div className="space-y-1">
            {item.children?.map((child) => (
              <NavigationLink key={child.href} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size="sm" showText={!collapsed} />
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className={cn("ml-auto h-8 w-8 p-0", collapsed && "ml-0")}
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
          />
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavigationLink key={item.href} item={item} />
          ))}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t p-4">
        <nav className="space-y-2">
          {bottomNavigationItems.map((item) => (
            <NavigationLink key={item.href} item={item} />
          ))}
        </nav>
      </div>

      {/* AI Assistant Quick Access */}
      {!collapsed && (
        <div className="border-t p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100 dark:from-blue-950 dark:to-purple-950 dark:border-blue-800"
          >
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700 dark:text-blue-300">AI Assistant</span>
          </Button>
        </div>
      )}
    </div>
  );
}