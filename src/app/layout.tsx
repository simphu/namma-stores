import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';

import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Namma Stores — Order from Nearby Local Shops',
  description:
    'Discover and order from local shops within 5km in your neighbourhood. Fast delivery and easy pickup from Whitefield, Bangalore.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {/* 🔥 AUTH MUST BE FIRST */}
        <AuthProvider>
          {/* 🔥 CART INSIDE AUTH */}
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}