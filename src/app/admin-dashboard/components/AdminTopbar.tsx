'use client';
import React from 'react';
import { Bell, Download, Shield, Sun } from 'lucide-react';

export default function AdminTopbar() {
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-stone-200 px-4 lg:px-8 2xl:px-12">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between h-16">
        <div>
          <h1 className="font-display font-700 text-xl text-stone-800">Admin Dashboard</h1>
          <p className="text-xs text-stone-500 font-body flex items-center gap-1">
            <Sun size={11} className="text-amber-400" />
            Wednesday, 1 April 2026 · Whitefield, Bangalore
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-600 text-xs font-display font-600 rounded-xl transition-colors">
            <Download size={13} />
            Export Report
          </button>
          <button className="relative p-2 rounded-xl hover:bg-stone-100 transition-colors">
            <Bell size={18} className="text-stone-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse-soft"></span>
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield size={14} className="text-blue-600" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-display font-600 text-stone-800">Namma Admin</p>
              <p className="text-xs text-stone-500 font-body">Platform Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}