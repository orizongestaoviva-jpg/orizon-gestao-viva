/*
 * ORIZON — Gestão Viva
 * AppLayout: Layout principal com sidebar colapsável
 * Design: Dark sidebar (#1e1b4b range), light content area
 * Navigation: Hierárquica por módulo com grupos
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  LayoutDashboard, Users, UserPlus, GraduationCap, Clock, FileText,
  BarChart3, Target, Heart, BookOpen, Rss, Video, Calendar, Kanban,
  TrendingUp, Sparkles, Settings, LogOut, ChevronLeft, ChevronRight,
  Bell, Search, ShoppingCart, Building2, Shield, Menu, X, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
  roles?: string[];
}

const navGroups: NavGroup[] = [
  {
    title: "Principal",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
      { icon: Rss, label: "Feed Corporativo", href: "/feed" },
      { icon: Bell, label: "Notificações", href: "/notificacoes", badge: "3" },
    ],
  },
  {
    title: "Pessoas",
    items: [
      { icon: Users, label: "Colaboradores", href: "/colaboradores" },
      { icon: UserPlus, label: "Recrutamento", href: "/recrutamento", badge: "5", badgeColor: "amber" },
      { icon: BookOpen, label: "Onboarding", href: "/onboarding" },
      { icon: GraduationCap, label: "Treinamentos", href: "/treinamentos" },
    ],
  },
  {
    title: "Operações",
    items: [
      { icon: Clock, label: "Ponto Eletrônico", href: "/ponto" },
      { icon: FileText, label: "DP Digital", href: "/dp-digital" },
      { icon: Calendar, label: "Agenda", href: "/agenda" },
      { icon: Kanban, label: "Kanban", href: "/kanban" },
    ],
  },
  {
    title: "Performance",
    items: [
      { icon: TrendingUp, label: "Vendas & Resultados", href: "/vendas" },
      { icon: Target, label: "Metas & OKRs", href: "/metas" },
      { icon: BarChart3, label: "Avaliação de Desempenho", href: "/avaliacao" },
      { icon: BarChart3, label: "Clima Organizacional", href: "/clima" },
    ],
  },
  {
    title: "Bem-estar & Cultura",
    items: [
      { icon: Heart, label: "Saúde & NR-1", href: "/saude" },
      { icon: Building2, label: "Cultura", href: "/cultura" },
      { icon: Video, label: "Reuniões", href: "/reunioes" },
    ],
  },
  {
    title: "Inteligência",
    items: [
      { icon: Sparkles, label: "IA — Assistente", href: "/ia", badge: "IA", badgeColor: "violet" },
    ],
  },
  {
    title: "Administração",
    roles: ["admin", "estrategico"],
    items: [
      { icon: ShoppingCart, label: "Admin Master", href: "/admin" },
      { icon: Shield, label: "Segurança & LGPD", href: "/seguranca" },
      { icon: Settings, label: "Configurações", href: "/configuracoes" },
    ],
  },
];

const roleLabels: Record<string, { label: string; color: string }> = {
  operacional: { label: "Operacional", color: "bg-emerald-500" },
  tatico: { label: "Tático", color: "bg-amber-500" },
  estrategico: { label: "Estratégico", color: "bg-violet-500" },
  admin: { label: "Admin Master", color: "bg-rose-500" },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout, switchRole } = useAuth();

  const filteredGroups = navGroups.filter(
    (g) => !g.roles || !user || g.roles.includes(user.role)
  );

  const roleInfo = user ? roleLabels[user.role] : null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-5 border-b border-sidebar-border shrink-0",
        collapsed && "justify-center px-2"
      )}>
        <div className="w-8 h-8 rounded-lg orizon-gradient flex items-center justify-center shrink-0 shadow-md">
          <span className="text-white font-bold text-sm">O</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-white font-extrabold text-base leading-tight">ORIZON</div>
            <div className="text-indigo-400 text-[10px] font-medium tracking-widest uppercase">Gestão Viva</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {filteredGroups.map((group) => (
          <div key={group.title} className="mb-2">
            {!collapsed && (
              <div className="px-3 py-1 text-[10px] font-bold text-indigo-400/60 uppercase tracking-widest mb-1">
                {group.title}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || location.startsWith(item.href + "/");
              const navItem = (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "sidebar-nav-item",
                    isActive && "active",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                          item.badgeColor === "amber" ? "bg-amber-500/20 text-amber-300" :
                          item.badgeColor === "violet" ? "bg-violet-500/20 text-violet-300" :
                          "bg-white/20 text-white/80"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{navItem}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }
              return navItem;
            })}
          </div>
        ))}
      </div>

      {/* User profile */}
      <div className="shrink-0 border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "w-full flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors",
              collapsed && "justify-center"
            )}>
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-indigo-600 text-white text-xs font-bold">
                  {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm font-semibold text-sidebar-foreground truncate">{user?.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={cn("w-1.5 h-1.5 rounded-full", roleInfo?.color)} />
                    <span className="text-[11px] text-indigo-300/80">{roleInfo?.label}</span>
                  </div>
                </div>
              )}
              {!collapsed && <ChevronDown className="w-3.5 h-3.5 text-indigo-400/60 shrink-0" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuLabel>
              <div className="font-semibold">{user?.name}</div>
              <div className="text-xs text-muted-foreground font-normal">{user?.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal py-1">Trocar perfil (Demo)</DropdownMenuLabel>
            {(["operacional", "tatico", "estrategico", "admin"] as const).map((r) => (
              <DropdownMenuItem key={r} onClick={() => switchRole(r)} className="text-sm">
                <span className={cn("w-2 h-2 rounded-full mr-2", roleLabels[r].color)} />
                {roleLabels[r].label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.info("Configurações em breve")}>
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 transition-all duration-300 ease-in-out relative",
          collapsed ? "w-[60px]" : "w-[240px]"
        )}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border flex items-center justify-center text-indigo-300 hover:text-white transition-colors z-10 shadow-md"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-[240px] flex flex-col z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-14 shrink-0 bg-background border-b border-border flex items-center gap-4 px-4 lg:px-6">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar colaboradores, módulos..."
                className="w-full h-9 pl-9 pr-4 bg-muted rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-ring/50 placeholder:text-muted-foreground"
                onFocus={() => toast.info("Busca global em breve")}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Role badge */}
            {roleInfo && (
              <Badge className={cn("text-white text-xs hidden sm:flex", roleInfo.color)}>
                {roleInfo.label}
              </Badge>
            )}

            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => toast.info("3 novas notificações")}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            {/* User avatar */}
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-indigo-600 text-white text-xs font-bold">
                {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
