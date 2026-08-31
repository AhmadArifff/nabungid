import { create } from 'zustand';
import { recommendWeeklySavingsForGoods } from '@nabungid/shared';

export interface ParcelItem {
  id: string;
  name: string;
  category: 'sembako' | 'snack' | 'perabotan';
  unit: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export const INITIAL_CATALOG_ITEMS: Omit<ParcelItem, 'quantity'>[] = [
  {
    id: 'item-1',
    name: 'Daging Sapi Segar Rendang',
    category: 'sembako',
    unit: '1 Kg',
    price: 145000,
    imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'item-2',
    name: 'Minyak Goreng Sawit Premium',
    category: 'sembako',
    unit: '2 Liter (Pouch)',
    price: 38000,
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'item-3',
    name: 'Telur Ayam Negeri Fresh',
    category: 'sembako',
    unit: '1 Tray (30 Butir)',
    price: 54000,
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'item-4',
    name: 'Beras Pandan Wangi Pulen',
    category: 'sembako',
    unit: '5 Kg (Karung)',
    price: 78000,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'item-5',
    name: 'Biskuit Khong Guan Classic',
    category: 'snack',
    unit: '1600 gram (Kaleng)',
    price: 115000,
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'item-6',
    name: 'Sirup Marjan Boudoin Cocopandan',
    category: 'snack',
    unit: '460 ml (2 Botol)',
    price: 46000,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'item-7',
    name: 'Kue Kering Nastar Wisman Spesial',
    category: 'snack',
    unit: '500 gram (Toples)',
    price: 95000,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'item-8',
    name: 'Set Toples Kaca Kristal Kedap Udara',
    category: 'perabotan',
    unit: 'Set isi 3 Pcs',
    price: 135000,
    imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'item-9',
    name: 'Wajan Penggorengan Granit Anti Lengket',
    category: 'perabotan',
    unit: 'Diameter 32 cm',
    price: 185000,
    imageUrl: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=400&q=80',
  },
];

interface ParcelState {
  cart: ParcelItem[];
  selectedCategory: 'all' | 'sembako' | 'snack' | 'perabotan';
  totalPrice: number;
  totalItemsCount: number;
  recommendedWeekly: number;
  setCategory: (category: 'all' | 'sembako' | 'snack' | 'perabotan') => void;
  addItem: (item: Omit<ParcelItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

export const useParcelStore = create<ParcelState>((set, get) => ({
  cart: [],
  selectedCategory: 'all',
  totalPrice: 0,
  totalItemsCount: 0,
  recommendedWeekly: 25000,

  setCategory: (category) => set({ selectedCategory: category }),

  addItem: (item) => {
    const { cart } = get();
    const existingIndex = cart.findIndex((i) => i.id === item.id);
    let newCart: ParcelItem[];

    if (existingIndex >= 0) {
      newCart = cart.map((i, idx) =>
        idx === existingIndex ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      newCart = [...cart, { ...item, quantity: 1 }];
    }

    const totalPrice = newCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalItemsCount = newCart.reduce((sum, i) => sum + i.quantity, 0);
    const recommendation = recommendWeeklySavingsForGoods(totalPrice, 1000000, 25000, 50);

    set({
      cart: newCart,
      totalPrice,
      totalItemsCount,
      recommendedWeekly: recommendation.roundedWeeklyNominal,
    });
  },

  removeItem: (itemId) => {
    const { cart } = get();
    const existing = cart.find((i) => i.id === itemId);
    if (!existing) return;

    let newCart: ParcelItem[];
    if (existing.quantity > 1) {
      newCart = cart.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i));
    } else {
      newCart = cart.filter((i) => i.id !== itemId);
    }

    const totalPrice = newCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalItemsCount = newCart.reduce((sum, i) => sum + i.quantity, 0);
    const recommendation = recommendWeeklySavingsForGoods(totalPrice, 1000000, 25000, 50);

    set({
      cart: newCart,
      totalPrice,
      totalItemsCount,
      recommendedWeekly: recommendation.roundedWeeklyNominal,
    });
  },

  clearCart: () => {
    set({
      cart: [],
      totalPrice: 0,
      totalItemsCount: 0,
      recommendedWeekly: 25000,
    });
  },
}));
