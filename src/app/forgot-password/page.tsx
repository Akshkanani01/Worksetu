"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase.client';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Supabase ને ઈમેલ મોકલવા માટે કહો
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`, // જ્યાં રીસેટ કરવાનું પેજ ખુલશે
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
        setIsLoading(false);
        return;
      }

      setMessage({ type: 'success', text: 'Password reset link sent! Check your email inbox.' });
      setTimeout(() => setIsLoading(false), 5000); // 5 સેકન્ડ પછી ફરીથી ક્લિક કરી શકાય

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
        <h2 className="text-2xl font-bold text-center mb-2">Forgot Password?</h2>
        <p className="text-center text-slate-400 text-sm mb-6">Enter your email and we'll send you a reset link.</p>

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
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="email" 
                required 
                placeholder="owner@workshop.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0A1025] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-purple-500 transition placeholder:text-slate-600"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 py-3.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-purple-900/30 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'} <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center text-xs text-slate-500 mt-2">
            Remember your password? <Link href="/login" className="text-purple-400 hover:underline cursor-pointer">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}