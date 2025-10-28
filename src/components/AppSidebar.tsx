import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Settings,
  ChevronDown,
  FileText,
  HelpCircle,
  Shield,
  Bell,
  PieChart,
  Clock,
  CreditCard,
  UserCog,
  Building,
  AlertCircle,
  CheckCircle,
  History,
  Search,
  Tag
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import AnimatedLogo from "@/components/AnimatedLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  onNavigate?: (path: string) => void;
  isSuperAdmin?: boolean;
  isAdmin?: boolean;
  profile?: any;
}

export const AppSidebar = ({ onNavigate, isSuperAdmin, isAdmin, profile }: AppSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const [openModules, setOpenModules] = React.useState<Record<string, boolean>>({});
  const sidebarRef = React.useRef<HTMLDivElement | null>(null);

  const navGroups = {
    dashboard: [
      { path: "/dashboard", label: "Tableau de Bord", icon: LayoutDashboard, admin: false }
    ],

    gestion: [
      {
        path: "/clients",
        label: "Clients",
        icon: Users,
        admin: false,
        children: [
          { path: "/clients/list", label: "Liste des Clients", icon: Users, admin: false },
          { path: "/clients/new", label: "Nouveau Client", icon: UserCog, admin: false },
          { path: "/clients/search", label: "Rechercher", icon: Search, admin: false }
        ]
      },
      {
        path: "/objects",
        label: "Objets & Catalogue",
        icon: Package,
        admin: false,
        children: [
          { path: "/objects/depot", label: "Objets en Dépôt", icon: Package, admin: false },
          { path: "/objects/evaluation", label: "Évaluations", icon: Tag, admin: false },
          { path: "/objects/categories", label: "Catégories", icon: FileText, admin: false }
        ]
      },
      {
        path: "/loans",
        label: "Prêts",
        icon: DollarSign,
        admin: false,
        children: [
          { path: "/loans/active", label: "Prêts Actifs", icon: CheckCircle, admin: false },
          { path: "/loans/pending", label: "En Attente", icon: Clock, admin: false },
          { path: "/loans/overdue", label: "Retards", icon: AlertCircle, admin: false },
          { path: "/loans/history", label: "Historique", icon: History, admin: false }
        ]
      }
    ],

    operations: [
      {
        path: "/payments",
        label: "Paiements",
        icon: CreditCard,
        admin: false,
        children: [
          { path: "/payments/receive", label: "Encaisser", icon: DollarSign, admin: false },
          { path: "/payments/history", label: "Historique", icon: History, admin: false },
          { path: "/payments/receipts", label: "Reçus", icon: FileText, admin: false }
        ]
      },
      { path: "/sales", label: "Ventes", icon: ShoppingBag, admin: false },
      { path: "/alerts", label: "Alertes & Rappels", icon: Bell, admin: false }
    ],

    analytics: [
      { path: "/analytics", label: "Tableau de Bord", icon: PieChart, admin: false },
      { path: "/reports", label: "Rapports", icon: FileText, admin: false },
      { path: "/trends", label: "Tendances", icon: TrendingUp, admin: false }
    ],

    administration: [
      { path: "/agency", label: "Agence", icon: Building, admin: true },
      { path: "/users", label: "Utilisateurs", icon: UserCog, admin: true },
      { path: "/security", label: "Sécurité", icon: Shield, admin: true },
      { path: "/settings", label: "Configuration", icon: Settings, admin: true }
    ],

    support: [
      { path: "/help", label: "Aide & Support", icon: HelpCircle, admin: false }
    ]
  };

  const handleNavigation = (path: string, label: string, event?: React.MouseEvent) => {
    try { event?.preventDefault(); } catch { }
    try { window.scrollTo({ top: window.scrollY, behavior: 'auto' }); } catch { }

    if (path.startsWith('/dashboard') && onNavigate) {
      const view = path.replace('/dashboard/', '') || 'dashboard';
      onNavigate(view);
    } else {
      navigate(path);
    }

    setTimeout(() => {
      try {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo({ top: window.scrollY });

        try {
          const sidebar = sidebarRef.current as HTMLElement | null;
          if (sidebar) {
            const selector = `[data-sidebar-path="${path}"]`;
            const el = sidebar.querySelector(selector) as HTMLElement | null;
            if (el && typeof el.scrollIntoView === 'function') {
              el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' });
            }
          }
        } catch { }

        document.documentElement.style.scrollBehavior = '';
      } catch { }
    }, 10);
  };

  const groupColors = {
    dashboard: { active: "bg-blue-600", text: "text-blue-600", accent: "#2563eb" },
    gestion: { active: "bg-emerald-600", text: "text-emerald-600", accent: "#059669" },
    operations: { active: "bg-purple-600", text: "text-purple-600", accent: "#9333ea" },
    analytics: { active: "bg-indigo-600", text: "text-indigo-600", accent: "#4f46e5" },
    administration: { active: "bg-red-600", text: "text-red-600", accent: "#dc2626" },
    support: { active: "bg-gray-600", text: "text-gray-600", accent: "#4b5563" }
  };

  const groupLabels = {
    dashboard: "Tableau de Bord",
    gestion: "Gestion",
    operations: "Opérations",
    analytics: "Analytics",
    administration: "Administration",
    support: "Support"
  };

  const IconWrap: React.FC<{ Icon: any; isActive?: boolean; color?: string; label?: string }> = ({ Icon, isActive, color, label }) => {
    return (
      <motion.span
        title={label}
        role="img"
        aria-label={label}
        whileHover={{
          rotate: 15,
          scale: 1.06,
          boxShadow: `0 8px 22px ${color ?? 'rgba(0,0,0,0.12)'}`
        }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className={cn("flex items-center justify-center w-5 h-5", isActive ? "text-white" : "text-gray-500")}
        style={{ display: "inline-flex" }}
      >
        <Icon />
      </motion.span>
    );
  };

  const renderNavGroup = (groupKey: string, items: any[], colorScheme: any) => {
    const filteredItems = items.filter(item =>
      !item.admin || (item.admin && (isSuperAdmin || isAdmin))
    );

    if (filteredItems.length === 0) return null;

    const renderNavItem = (item: any) => {
      const hasChildren = Array.isArray(item.children) && item.children.length > 0;
      const childMatches = hasChildren && item.children.some((child: any) => location.pathname === child.path || location.pathname.startsWith(child.path));
      const isOpen = openModules[item.path] ?? !!childMatches;
      const isActive = location.pathname === item.path || (hasChildren && childMatches);

      return (
        <div key={item.path} className="mb-0.5">
          <SidebarMenuItem>
            <SidebarMenuButton
              data-sidebar-path={item.path}
              isActive={location.pathname === item.path}
              tooltip={item.label}
              onClick={(e) => {
                if (hasChildren) {
                  const currentScroll = (sidebarRef.current as any)?.scrollTop ?? 0;
                  setOpenModules(prev => ({ ...prev, [item.path]: !isOpen }));
                  requestAnimationFrame(() => {
                    try { (sidebarRef.current as any)?.scrollTo?.({ top: currentScroll, behavior: 'auto' }); } catch { }
                  });
                } else {
                  handleNavigation(item.path, item.label, e);
                }
              }}
              aria-expanded={hasChildren ? isOpen : undefined}
              aria-controls={hasChildren ? `${item.path}-submenu` : undefined}
              className={cn(
                "group flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer select-none transition-colors duration-200",
                isActive ? "bg-opacity-100 text-white" : "hover:bg-gray-50 dark:hover:bg-gray-700"
              )}
              style={isActive ? { background: colorScheme.accent, boxShadow: "0 6px 18px rgba(0,0,0,0.08)" } : undefined}
            >
              <div className="w-5 h-5 flex-shrink-0">
                <IconWrap Icon={item.icon} isActive={isActive} color={isActive ? (colorScheme.accent + "80") : (colorScheme.accent + "40")} label={item.label} />
              </div>

              <span className={cn("text-sm font-medium truncate", isActive ? "text-white" : "text-gray-800 dark:text-gray-200")}>
                {item.label}
              </span>

              {hasChildren && (
                <div className="ml-auto flex items-center gap-2">
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen ? "rotate-180 text-gray-600" : "text-gray-400")} />
                </div>
              )}

              {!hasChildren && location.pathname === item.path && state !== "collapsed" && (
                <span className="ml-auto w-2 h-2 bg-white rounded-full" />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>

          {hasChildren && (
            <div
              id={`${item.path}-submenu`}
              className={cn(
                "ml-6 mt-1 space-y-1 overflow-hidden transition-[max-height,opacity,transform] duration-250 ease-in-out",
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
              )}
              style={{ maxHeight: isOpen ? 1000 : 0 }}
            >
              {item.children.filter((child: any) => !child.admin || (child.admin && (isSuperAdmin || isAdmin))).map((child: any) => {
                const childActive = location.pathname === child.path;
                return (
                  <SidebarMenuItem key={child.path}>
                    <SidebarMenuButton
                      data-sidebar-path={child.path}
                      isActive={childActive}
                      tooltip={child.label}
                      onClick={(e) => handleNavigation(child.path, child.label, e)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-150",
                        childActive ? "text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      )}
                      style={childActive ? { background: colorScheme.accent } : undefined}
                    >
                      <div className="w-4 h-4">
                        <IconWrap Icon={child.icon ?? FileText} isActive={childActive} color={colorScheme.accent} label={child.label} />
                      </div>
                      <span className="truncate">{child.label}</span>
                      {childActive && state !== "collapsed" && <span className="ml-auto w-2 h-2 bg-white rounded-full" />}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </div>
          )}
        </div>
      );
    };

    return (
      <SidebarGroup key={groupKey} className="mb-3">
        {state !== "collapsed" && (
          <SidebarGroupLabel className={cn(
            "text-xs font-semibold uppercase tracking-wide px-2 mb-2 border-l-4 pl-3",
            "dark:text-gray-300"
          )} style={{ borderColor: colorScheme.accent }}>
            {groupLabels[groupKey]}
          </SidebarGroupLabel>
        )}

        <SidebarMenu>
          {filteredItems.map(item => renderNavItem(item))}
        </SidebarMenu>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar className="border-r bg-white dark:bg-gray-900 shadow-sm">
      <SidebarHeader className="p-5 border-b dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="flex items-center gap-3">
          <div className="cursor-pointer transition-transform duration-200">
            <AnimatedLogo
              size={state === "collapsed" ? 32 : 40}
              animated={true}
              mainColor="text-amber-400"
              secondaryColor="text-yellow-600"
            />
          </div>

          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span className="font-bold text-lg dark:text-white text-gray-900 bg-gradient-gold bg-clip-text text-transparent">
                GageMoney
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Gestion de Prêts sur Gages</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent ref={sidebarRef as any} className="px-3 py-5 space-y-2">
        {Object.entries(navGroups).map(([groupKey, items]) =>
          renderNavGroup(groupKey, items, (groupColors as any)[groupKey])
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="space-y-3">
          {state !== "collapsed" && profile && (
            <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 shadow-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {profile.full_name?.[0] || profile.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {profile.full_name || "Utilisateur"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {profile.email}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            {state !== "collapsed" && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <small className="text-xs text-gray-500 dark:text-gray-400 font-medium">Système actif</small>
              </div>
            )}
            {state === "collapsed" && (
              <div className="flex justify-center w-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
