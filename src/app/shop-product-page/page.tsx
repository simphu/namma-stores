import React from 'react';
import ShopHeader from './components/ShopHeader';
import FilterBar from './components/FilterBar';
import StickyCartBar from './components/StickyCartBar';
import PageHeader from './components/PageHeader';
import DealsSection from './components/DealsSection';
import SearchBar from './components/SearchBar';
import MenuCategories from './components/MenuCategories';
import FloatingMenuButton from './components/FloatingMenuButton';
import FooterSection from './components/FooterSection';

export default function ShopProductPage() {
  return (
    <main className="min-h-screen bg-appbg font-body pb-28">
      {/* Sticky Page Header */}
      <PageHeader />

      {/* Shop Banner + Info */}
      <ShopHeader />

      {/* Deals / Offers Section */}
      <DealsSection />

      {/* Search Bar */}
      <SearchBar />

      {/* Filter Pill Bar */}
      <FilterBar />

      {/* Menu Categories with Swiggy-style product list */}
      <MenuCategories />

      {/* Footer */}
      <FooterSection />

      {/* Floating MENU Button */}
      <FloatingMenuButton />

      {/* Sticky Cart Bar */}
      <StickyCartBar />
    </main>
  );
}