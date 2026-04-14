import React from 'react';
import Icon from '@/components/ui/AppIcon';
import ProductRow, { Product } from './ProductRow';

interface MenuCategory {
  id: number;
  title: string;
  count: number;
  products: Product[];
  defaultOpen?: boolean;
}

const allProducts: Product[] = [
{
  id: 1,
  name: 'Farm Fresh Tomatoes',
  description: 'Locally sourced, vine-ripened red tomatoes. Perfect for curries and salads.',
  price: 39,
  originalPrice: 55,
  image: 'https://images.unsplash.com/photo-1615228429505-4ce1039cd8f6',
  imageAlt: 'Bright red ripe tomatoes in a rustic wooden bowl on a white surface',
  tag: 'Bestseller',
  isVeg: true,
  weight: '500g',
  rating: 4.5
},
{
  id: 2,
  name: 'Amul Full Cream Milk',
  description: 'Rich, creamy full cream milk. Pasteurised and homogenised for freshness.',
  price: 68,
  image: 'https://img.rocket.new/generatedImages/rocket_gen_img_114ee0f1d-1772459382164.png',
  imageAlt: 'Glass bottle of fresh white milk with a clean white background and morning light',
  tag: 'Popular',
  isVeg: true,
  weight: '1 litre',
  rating: 4.3
},
{
  id: 3,
  name: 'Organic Basmati Rice',
  description: 'Long-grain aged basmati with natural aroma. Ideal for biryani and pulao.',
  price: 145,
  image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
  imageAlt: 'Uncooked white basmati rice grains spread on a dark wooden surface with warm overhead light',
  tag: 'Popular',
  isVeg: true,
  weight: '1 kg',
  rating: 4.4
},
{
  id: 4,
  name: 'Assorted Fruit Basket',
  description: 'Seasonal fruits handpicked from local farms. Mix of 4–5 varieties daily.',
  price: 249,
  originalPrice: 299,
  image: 'https://images.unsplash.com/photo-1461149295435-73d662820e17',
  imageAlt: 'Colourful assorted fresh fruits including mangoes oranges and grapes in a bright wicker basket',
  tag: 'Offer',
  isVeg: true,
  weight: '1 kg',
  rating: 4.2
},
{
  id: 5,
  name: 'Chicken Curry Cut',
  description: 'Fresh antibiotic-free chicken, cleaned and curry cut. Marinate and cook.',
  price: 189,
  originalPrice: 220,
  image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1fc4d5a0c-1772138537550.png',
  imageAlt: 'Fresh raw chicken pieces on a clean white plate with herbs in bright kitchen lighting',
  tag: 'Bestseller',
  isVeg: false,
  weight: '500g',
  rating: 4.6
},
{
  id: 6,
  name: 'Sooji Halwa Mix',
  description: 'Ready-to-cook semolina halwa mix with ghee and dry fruits. Serves 4.',
  price: 89,
  originalPrice: 110,
  image: 'https://img.rocket.new/generatedImages/rocket_gen_img_19131b794-1773055105454.png',
  imageAlt: 'Golden semolina halwa garnished with saffron and pistachios in a brass bowl',
  tag: 'New',
  isVeg: true,
  weight: '250g',
  rating: 4.1
},
{
  id: 7,
  name: 'Hyderabadi Chicken Biryani',
  description: 'Aromatic dum biryani with tender chicken, saffron, and caramelised onions.',
  price: 299,
  originalPrice: 349,
  image: "https://images.unsplash.com/photo-1719935251310-195f5c49b3e4",
  imageAlt: 'Fragrant Hyderabadi chicken biryani served in a copper handi with garnish',
  tag: 'Bestseller',
  isVeg: false,
  weight: '500g',
  rating: 4.8
},
{
  id: 8,
  name: 'Veg Dum Biryani',
  description: 'Fragrant basmati rice layered with seasonal vegetables and whole spices.',
  price: 199,
  image: "https://images.unsplash.com/photo-1596560520688-e1ecc9da2099",
  imageAlt: 'Colourful vegetable dum biryani in a white bowl with raita on the side',
  tag: 'Popular',
  isVeg: true,
  weight: '400g',
  rating: 4.3
},
{
  id: 9,
  name: 'Paneer Tikka',
  description: 'Marinated cottage cheese cubes grilled in tandoor with bell peppers and onions.',
  price: 179,
  originalPrice: 210,
  image: "https://images.unsplash.com/photo-1680359870402-5cc2954e50c6",
  imageAlt: 'Golden paneer tikka skewers with colourful bell peppers on a wooden board',
  tag: 'Bestseller',
  isVeg: true,
  weight: '300g',
  rating: 4.7
},
{
  id: 10,
  name: 'Chicken 65',
  description: 'Crispy deep-fried chicken with curry leaves, green chillies, and spices.',
  price: 159,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_176cbfdfa-1772866181996.png",
  imageAlt: 'Crispy golden chicken 65 garnished with curry leaves and lemon wedge on a plate',
  tag: 'Popular',
  isVeg: false,
  weight: '250g',
  rating: 4.5
},
{
  id: 11,
  name: 'Fresh Lime Soda',
  description: 'Chilled sparkling lime soda with a hint of mint. Refreshing and tangy.',
  price: 49,
  image: "https://images.unsplash.com/photo-1582589561741-e432becd7f79",
  imageAlt: 'Tall glass of fresh lime soda with mint leaves and ice cubes on a bright background',
  isVeg: true,
  weight: '300ml',
  rating: 4.2
},
{
  id: 12,
  name: 'Mango Lassi',
  description: 'Thick creamy yoghurt blended with Alphonso mango pulp. Chilled and sweet.',
  price: 79,
  originalPrice: 99,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d2160a5f-1772889720125.png",
  imageAlt: 'Creamy mango lassi in a tall glass garnished with mango slices and saffron strands',
  tag: 'Popular',
  isVeg: true,
  weight: '350ml',
  rating: 4.6
}];


const categories: MenuCategory[] = [
{
  id: 1,
  title: 'Recommended',
  count: 4,
  defaultOpen: true,
  products: allProducts.slice(0, 4)
},
{
  id: 2,
  title: 'Biryani',
  count: 2,
  defaultOpen: false,
  products: allProducts.slice(6, 8)
},
{
  id: 3,
  title: 'Starters',
  count: 2,
  defaultOpen: false,
  products: allProducts.slice(8, 10)
},
{
  id: 4,
  title: 'Beverages',
  count: 2,
  defaultOpen: false,
  products: allProducts.slice(10, 12)
}];


interface CategorySectionProps {
  category: MenuCategory;
}

function CategorySection({ category }: CategorySectionProps) {
  return (
    <div className="bg-white mb-2 rounded-xl overflow-hidden shadow-sm border border-gray-100">
      {/* Category Header */}
      <div className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-base font-700 text-darker">
            {category.title}
          </h2>
          <span className="text-xs text-muted font-body bg-gray-100 px-2 py-0.5 rounded-full">
            {category.count}
          </span>
        </div>
        <Icon
          name={category.defaultOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'}
          size={18}
          className="text-muted" />
        
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-4" />

      {/* Products — show only if defaultOpen */}
      {category.defaultOpen &&
      <div className="px-4 pt-2 pb-4">
          {category.products.map((product) =>
        <ProductRow key={product.id} product={product} />
        )}
        </div>
      }
    </div>);

}

export default function MenuCategories() {
  return (
    <section className="max-w-2xl mx-auto px-4 pt-4 pb-6">
      {categories.map((category) =>
      <CategorySection key={category.id} category={category} />
      )}
    </section>);

}