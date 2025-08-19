"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbProps {
  className?: string;
  customItems?: BreadcrumbItem[];
}

export function Breadcrumb({ className, customItems }: BreadcrumbProps) {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;

    const pathSegments = pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [];

    // Always start with dashboard for authenticated routes
    if (pathSegments[0] === "dashboard") {
      items.push({
        label: "Dashboard",
        href: "/dashboard",
        icon: Home,
      });

      // Map path segments to readable labels
      const pathLabels: Record<string, string> = {
        search: "Company Search",
        companies: "Companies",
        compare: "Compare",
        analytics: "Analytics",
        trends: "Market Trends",
        risk: "Risk Assessment",
        network: "Network Analysis",
        geographic: "Geographic Insights",
        reports: "Reports",
        templates: "Templates",
        bookmarks: "Bookmarks",
        team: "Team",
        settings: "Settings",
        help: "Help & Support",
      };

      let currentPath = "/dashboard";
      for (let i = 1; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        currentPath += `/${segment}`;
        
        // Don't add dynamic routes (UUIDs, etc.)
        if (!segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-/)) {
          items.push({
            label: pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
            href: i === pathSegments.length - 1 ? undefined : currentPath,
          });
        }
      }
    }

    return items;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        return (
          <div key={item.href || item.label} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground/50" />
            )}
            
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-1">
                {item.icon && <item.icon className="h-4 w-4" />}
                <span className={cn(
                  "font-medium",
                  isLast && "text-foreground"
                )}>
                  {item.label}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}