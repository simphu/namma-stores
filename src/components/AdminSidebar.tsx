'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard, Store, ShoppingBag, Tag, Users,
  Settings, LogOut, Menu, X, ChevronRight, Shield, Bell
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const navItems = [
  { key: 'admin-nav-dashboard', href: '/admin-dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { key: 'admin-nav-sellers', href: '/admin-dashboard', icon: Store, label: 'Sellers', badge: '5' },
  { key: 'admin-nav-orders', href: '/admin-dashboard', icon: ShoppingBag, label: 'Orders', badge: null },
  { key: 'admin-nav-categories', href: '/admin-dashboard', icon: Tag, label: 'Categories', badge: null },
  { key: 'admin-nav-customers', href: '/admin-dashboard', icon: Users, label: 'Customers', badge: null },
  { key: 'admin-nav-settings', href: '/admin-dashboard', icon: Settings, label: 'Settings', badge: null },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-2.5 px-4 py-5 border-b border-stone-200 ${collapsed ? 'justify-center px-2' : ''}`}>
        <AppLogo size={32} />
        {!collapsed && (
          <div>
            <span className="font-display font-700 text-base text-orange-600 block leading-tight">Namma Stores</span>
            <span className="text-xs text-stone-500 font-body">Admin Panel</span>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="mx-3 mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2">
          <Shield size={14} className="text-blue-600" />
          <span className="text-xs font-display font-600 text-blue-700">Platform Admin</span>
        </div>
      )}

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems?.map((item) => {
          const isActive = pathname === item?.href;
          const Icon = item?.icon;
          return (
            <Link
              key={item?.key}
              href={item?.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative ${
                isActive ? 'bg-orange-50 text-orange-600' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'
              } ${collapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-orange-600' : 'text-stone-500 group-hover:text-stone-700'}`} />
              {!collapsed && (
                <>
                  <span className={`text-sm font-display flex-1 ${isActive ? 'font-600' : 'font-500'}`}>{item?.label}</span>
                  {item?.badge && (
                    <span className="min-w-[20px] h-5 bg-red-500 text-white text-xs font-display font-700 rounded-full flex items-center justify-center px-1 tabular-nums">
                      {item?.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item?.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`border-t border-stone-200 p-3 space-y-1 ${collapsed ? 'px-2' : ''}`}>
        <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-500 hover:bg-stone-100 transition-colors ${collapsed ? 'justify-center px-2' : ''}`}>
          <Bell size={18} />
          {!collapsed && <span className="text-sm font-display font-500">Notifications</span>}
        </button>
        <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors ${collapsed ? 'justify-center px-2' : ''}`}>
          <LogOut size={18} />
          {!collapsed && <span className="text-sm font-display font-500">Sign Out</span>}
        </button>
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2 mt-2 bg-stone-50 rounded-xl">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-sm font-display font-700 text-blue-600">NA</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-display font-600 text-stone-800 truncate">Namma Admin</p>
              <p className="text-xs text-stone-500 font-body truncate">admin@nammastores.in</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-stone-200 h-screen sticky top-0 transition-all duration-300 ease-in-out flex-shrink-0 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 w-6 h-6 bg-white border border-stone-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
        >
          {collapsed ? <ChevronRight size={12} className="text-stone-500" /> : <X size={12} className="text-stone-500" />}
        </button>
        <SidebarContent />
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-stone-200 rounded-xl shadow-sm"
      >
        <Menu size={20} className="text-stone-700" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-white h-full shadow-2xl">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-stone-100">
              <X size={18} className="text-stone-500" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}