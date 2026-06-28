"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase.client';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check if user is already logged in (Supabase automatically logs them in via the link)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };
    checkSession();
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
        setIsLoading(false);
        return;
      }

      setMessage({ type: 'success', text: 'Password updated successfully! Redirecting...' });
      setTimeout(() => {
        router.push('/dashboard/owner');
      }, 1500);

    } catch (err) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04080F] text-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-dot-grid opacity-80 z-0"></div>
      <div className="fixed top-1/2 left-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] z-0"></div>

      <div className="relative z-10 w-full max-w-md glass-panel-deep rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/60">
        
        {/* Logo & Heading */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center font-black text-[#04080F] text-lg">W</div>
          <span className="text-xl font-bold tracking-tight text-white">WORKSETU</span>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Set New Password</h2>
        <p className="text-center text-slate-400 text-sm mb-6">Enter your new password below.</p>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${message.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/20' : 'bg-red-500/20 text-red-300 border border-red-500/20'}`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="password" 
                required 
                placeholder="Min. 6 characters" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0A1025] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-purple-500 transition placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="password" 
                required 
                placeholder="Confirm your new password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#0A1025] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-purple-500 transition placeholder:text-slate-600"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 py-3.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-purple-900/30 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? 'Updating...' : 'Update Password'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}