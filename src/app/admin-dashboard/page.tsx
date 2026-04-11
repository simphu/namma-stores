import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminDashboardClient from './components/AdminDashboardClient';

export default function AdminDashboardPage() {
  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <AdminDashboardClient />
      </main>
    </div>
  );
}