'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
  setLoading(true);

  // 🔥 STEP 1: SIGNUP
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  console.log("SIGNUP RESPONSE:", data);

  if (error) {
    alert(error.message);
    setLoading(false);
    return;
  }

  // ❗ CRITICAL CHECK
  if (!data.user) {
    alert("User not available yet. Try logging in.");
    setLoading(false);
    return;
  }

  const userId = data.user.id;
  console.log("USER ID:", userId);

  // 🔥 STEP 2: INSERT PROFILE
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      name,
      role,
    });

  if (profileError) {
    console.error("PROFILE ERROR:", profileError);
    alert(profileError.message);
    setLoading(false);
    return;
  }

  // 🔥 STEP 3: INSERT SELLER (ONLY IF SELLER)
  if (role === 'seller') {
    const { error: sellerError } = await supabase
      .from('sellers')
      .insert({
        id: userId, // 🔥 MUST
        shop_name: name,
        is_open: false,
        is_accepting_orders: false,
        is_onboarded: false,
      });

    console.log("SELLER INSERT ERROR:", sellerError);

    if (sellerError) {
      alert(sellerError.message);
      setLoading(false);
      return;
    }
  }

  // 🔥 STEP 4: REDIRECT
  if (role === 'seller') {
    window.location.href = '/onboarding/seller';
  } else {
    window.location.href = '/';
  }

  setLoading(false);
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Create Account</h2>

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-3 p-2 border rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="w-full mb-4 p-2 border rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="customer">Customer</option>
          <option value="seller">Seller</option>
        </select>

        <button
          onClick={handleSignup}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
      </div>
    </div>
  );
}