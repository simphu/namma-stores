'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  setLoading(true);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("LOGIN DATA:", data);
  console.log("LOGIN ERROR:", error);

  if (error) {
    alert(error.message);
    setLoading(false);
    return;
  }

  if (!data.user) {
    alert('Login failed');
    setLoading(false);
    return;
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', data.user.id)
    .maybeSingle()

  console.log("PROFILE:", profile);

  if (!profile) {
    alert('Profile missing');
    setLoading(false);
    return;
  }

  // Redirect based on role
const { data: seller } = await supabase
  .from('sellers')
  .select('is_onboarded')
  .eq('id', data.user.id)
  .maybeSingle();

if (profile.role === 'seller') {
  if (!seller || !seller.is_onboarded) {
    window.location.href = '/onboarding/seller';
  } else {
    window.location.href = '/seller-dashboard';
  }
} else {
  window.location.href = '/';
}

  setLoading(false);
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}