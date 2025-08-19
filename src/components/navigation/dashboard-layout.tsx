"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Breadcrumb } from "./breadcrumb";
import { UserProfile } from "@/components/auth/user-profile";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Bell,
  Plus,
  Download,
  Filter,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  showQuickActions?: boolean;
  pageTitle?: string;
  pageDescription?: string;
  actions?: React.ReactNode;
}

export function DashboardLayout({
  children,
  className,
  showQuickActions = true,
  pageTitle,
  pageDescription,
  actions,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-transform lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header bar */}
        <header className="flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Breadcrumb and page info */}
          <div className="flex flex-1 items-center gap-4">
            <Breadcrumb className="hidden sm:flex" />
            
            {/* Global search */}
            <div className="relative ml-auto max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search companies, reports..."
                className="pl-9 bg-muted/50"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                3
              </Badge>
            </Button>

            <ModeToggle />
            <UserProfile />
          </div>
        </header>

        {/* Page header with title and actions */}
        {(pageTitle || showQuickActions) && (
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex flex-col gap-4 p-4 lg:p-6">
              {/* Page title section */}
              {pageTitle && (
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
                    {pageDescription && (
                      <p className="text-muted-foreground">{pageDescription}</p>
                    )}
                  </div>
                  {actions && <div className="flex items-center gap-2">{actions}</div>}
                </div>
              )}

              {/* Quick actions toolbar */}
              {showQuickActions && (
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Search
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  
                  {/* AI Assistant quick access */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100 dark:from-blue-950 dark:to-purple-950 dark:border-blue-800 ml-auto"
                  >
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-700 dark:text-blue-300 hidden sm:inline">
                      AI Assistant
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main content area */}
        <main className={cn("flex-1 overflow-auto p-4 lg:p-6", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}