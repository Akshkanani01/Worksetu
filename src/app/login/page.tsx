"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, User, Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase.client';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'owner' | 'karigar'>('owner');
  
  // Owner Email & Password State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Karigar State
  const [karigarId, setKarigarId] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const supabase = createClient();

  // ===== Owner: Email & Password Login =====
  const handleOwnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
        setIsLoading(false);
        return;
      }

      if (data.session) {
        router.push('/dashboard/owner');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Something went wrong. Try again.' });
      setIsLoading(false);
    }
  };

  // ===== Karigar: PIN Login =====
  const handleKarigarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const fullPin = pin.join('');
    if (fullPin.length !== 4) {
      setMessage({ type: 'error', text: 'Please enter a valid 4-digit PIN.' });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/karigar-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ karigarId, pin: fullPin })
      });

      if (res.redirected) {
        window.location.href = res.url;
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Invalid ID or PIN.' });
        setIsLoading(false);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection failed. Try again.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04080F] text-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-dot-grid opacity-80 z-0"></div>
      <div className="fixed top-1/2 left-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] z-0"></div>
      <div className="fixed bottom-1/2 right-1/4 w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[120px] z-0"></div>

      <div className="relative z-10 w-full max-w-md glass-panel-deep rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/60">
        
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center font-black text-[#04080F] text-lg">W</div>
          <span className="text-xl font-bold tracking-tight text-white">WORKSETU</span>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#0A1025] p-1 rounded-full border border-white/10 mb-8">
          <button 
            onClick={() => setActiveTab('owner')}
            className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${activeTab === 'owner' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <User className="w-3 h-3 inline mr-1" /> Owner
          </button>
          <button 
            onClick={() => setActiveTab('karigar')}
            className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${activeTab === 'karigar' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <Lock className="w-3 h-3 inline mr-1" /> Karigar
          </button>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${message.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/20' : 'bg-red-500/20 text-red-300 border border-red-500/20'}`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {message.text}
          </div>
        )}

        {/* Owner Form (Email + Password) */}
        {activeTab === 'owner' && (
          <form onSubmit={handleOwnerLogin} className="space-y-6">
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

            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="password" 
                  required 
                  placeholder="Enter your password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0A1025] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-purple-500 transition placeholder:text-slate-600"
                />
              </div>
              <div className="text-[10px] text-slate-500 mt-2">
                <span className="text-purple-400 cursor-pointer hover:underline">Forgot password?</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 py-3.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-purple-900/30 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? 'Logging in...' : 'Login'} <ArrowRight className="w-4 h-4" />
            </button>
            
            <div className="text-center text-xs text-slate-500 mt-2">
              Don't have an account? <span className="text-purple-400 hover:underline cursor-pointer">Sign up</span>
            </div>
          </form>
        )}

        {/* Karigar Form (Unchanged) */}
        {activeTab === 'karigar' && (
          <form onSubmit={handleKarigarLogin} className="space-y-6">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Karigar ID / Phone</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  required 
                  placeholder="Enter your assigned ID" 
                  value={karigarId} 
                  onChange={(e) => setKarigarId(e.target.value)}
                  className="w-full bg-[#0A1025] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-400 transition placeholder:text-slate-600"
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">4-Digit Secure PIN</label>
              <div className="flex gap-3 justify-between">
                {pin.map((digit, index) => (
                  <input 
                    key={index}
                    type="password" 
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newPin = [...pin];
                      newPin[index] = e.target.value.replace(/[^0-9]/g, '');
                      setPin(newPin);
                      if (e.target.value && index < 3) {
                        const nextInput = document.getElementById(`pin-${index + 1}`);
                        if (nextInput) (nextInput as HTMLInputElement).focus();
                      }
                    }}
                    id={`pin-${index}`}
                    className="w-14 h-14 bg-[#0A1025] border border-white/10 rounded-xl text-center text-lg font-bold text-white outline-none focus:border-cyan-400 transition shadow-inner"
                  />
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Enter the 4-digit PIN provided by your Owner.</p>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 py-3.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-purple-900/30 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? 'Verifying...' : 'Login to Dashboard'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}