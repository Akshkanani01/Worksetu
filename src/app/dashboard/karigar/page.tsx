"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, Clock, ImageIcon, MessageSquare, LogOut, 
  Package, Loader2, Send, X, Calendar, Upload, Trash2, MoreHorizontal
} from 'lucide-react';
import { createClient } from '@/lib/supabase.client';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { toast, Toaster } from 'react-hot-toast';

const supabase = createClient();

export default function KarigarDashboard() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'gu' | 'hi'>('en');
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [uploadingFile, setUploadingFile] = useState<number | null>(null);
  const [deletingTask, setDeletingTask] = useState<number | null>(null);
  const [karigarData, setKarigarData] = useState<{id: string, name: string, owner_id: string} | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const fileInputRefs = useRef<{[key: number]: HTMLInputElement | null}>({});

  // === 1. Get Karigar Session ===
  useEffect(() => {
    const checkSession = () => {
      try {
        const cookies = document.cookie.split(';').reduce((acc, c) => {
          const [key, val] = c.trim().split('=');
          if (key === 'worksetu_session') acc[key] = decodeURIComponent(val);
          return acc;
        }, {} as Record<string, string>);
        if (cookies.worksetu_session) {
          const session = JSON.parse(cookies.worksetu_session);
          if (session && session.id) {
            setKarigarData({ id: session.id, name: session.name, owner_id: session.owner_id });
            return true;
          }
        }
      } catch (e) {}
      return false;
    };
    if (!checkSession()) {
      const timer = setTimeout(() => {
        if (!checkSession()) router.push('/login');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [router]);

  // === 2. Fetch Tasks & Realtime ===
  const fetchTasks = async () => {
    if (!karigarData) return;
    const { data, error } = await supabase.from('tasks').select('*').eq('karigar_id', karigarData.id).order('created_at', { ascending: false });
    if (error) toast.error('Error loading tasks');
    else setTasks(data || []);
  };

  useEffect(() => {
    if (!karigarData) return;
    fetchTasks().then(() => setLoading(false));
    const channel = supabase.channel('tasks-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `karigar_id=eq.${karigarData.id}` }, fetchTasks)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [karigarData]);

  // === 3. Chat System ===
  useEffect(() => {
    if (!karigarData) return;
    const loadMessages = async () => {
      const { data, error } = await supabase.from('messages').select('*')
        .or(`sender_id.eq.${karigarData.id},receiver_id.eq.${karigarData.id}`)
        .order('created_at', { ascending: true });
      if (!error) setMessages(data || []);
    };
    loadMessages();

    const channel = supabase.channel('chat-room')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        if ((payload.new.sender_id === karigarData.id && payload.new.receiver_id === karigarData.owner_id) ||
            (payload.new.sender_id === karigarData.owner_id && payload.new.receiver_id === karigarData.id)) {
          setMessages((prev) => [...prev, payload.new]);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [karigarData]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !karigarData) return;
    setChatLoading(true);
    const { error } = await supabase.from('messages').insert({
      sender_id: karigarData.id, receiver_id: karigarData.owner_id, content: newMessage
    });
    setChatLoading(false);
    if (!error) setNewMessage('');
  };

  // === 4. Actions ===
  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    setUpdating(taskId);
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
    setUpdating(null);
    if (error) toast.error('Error updating status');
    else toast.success('Status updated to ' + newStatus);
  };

  const uploadFile = async (taskId: number, file: File) => {
    if (!file) return;
    setUploadingFile(taskId);
    const safeName = file.name.replace(/\s+/g, '_');
    const filePath = `task-${taskId}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from('task_proofs').upload(filePath, file);
    setUploadingFile(null);
    if (uploadError) {
      toast.error('Upload failed: ' + uploadError.message);
      return;
    }
    const { data: urlData } = supabase.storage.from('task_proofs').getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;
    const { error: updateError } = await supabase.from('tasks').update({ proof_url: publicUrl }).eq('id', taskId);
    if (updateError) toast.error('Failed to save proof URL');
    else toast.success('Proof uploaded & linked!');
  };

  const deleteTask = async (taskId: number, taskTitle: string) => {
    if(!confirm(`Are you sure you want to permanently delete the task "${taskTitle}"?`)) return;
    setDeletingTask(taskId);
    await supabase.from('tasks').delete().eq('id', taskId);
    setDeletingTask(null);
  };

  const handleLogout = () => { 
    document.cookie = "worksetu_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"; 
    router.push('/login'); 
  };

  // === 5. Translation & Status Config ===
  const t = {
    en: { assigned: 'Assigned', in_progress: 'In Progress', pending: 'Pending', completed: 'Completed', todays_tasks: "Today's Tasks", upload_proof: 'Upload Proof', chat_owner: 'Chat with Owner', online: 'Online', waiting: 'Waiting', send: 'Send', uploading: 'Uploading...', no_tasks: 'No tasks assigned yet.', no_messages: 'No messages yet.', task_details: 'Task Details', status: 'Status', description: 'Description', close: 'Close', deleting: 'Deleting...', rate: 'Rate' },
    gu: { assigned: 'અસાઈન કરેલ', in_progress: 'ચાલુ કામ', pending: 'પેન્ડિંગ', completed: 'પૂર્ણ', todays_tasks: "આજના કામ", upload_proof: 'પુરાવો મૂકો', chat_owner: 'ઓનર સાથે ચેટ કરો', online: 'ઑનલાઇન', waiting: 'રાહ જુઓ', send: 'મોકલો', uploading: 'અપલોડ થઈ રહ્યું...', no_tasks: 'હજુ કોઈ કામ અસાઈન થયું નથી.', no_messages: 'હજુ કોઈ મેસેજ નથી.', task_details: 'કામની વિગતો', status: 'સ્થિતિ', description: 'વર્ણન', close: 'બંધ કરો', deleting: 'ડિલીટ થઈ રહ્યું...', rate: 'ભાવ (₹)' },
    hi: { assigned: 'असाइन किया गया', in_progress: 'प्रगति पर', pending: 'लंबित', completed: 'पूर्ण', todays_tasks: "आज के कार्य", upload_proof: 'प्रमाण अपलोड करें', chat_owner: 'मालिक से चैट करें', online: 'ऑनलाइन', waiting: 'प्रतीक्षा करें', send: 'भेजें', uploading: 'अपलोड हो रहा है...', no_tasks: 'अभी कोई कार्य असाइन नहीं हुआ।', no_messages: 'अभी कोई संदेश नहीं।', task_details: 'कार्य विवरण', status: 'स्थिति', description: 'विवरण', close: 'बंद करें', deleting: 'हटाया जा रहा है...', rate: 'दर (₹)' }
  };

  const getStatusConfig = (status: string) => {
    if (status === 'Completed') return { color: 'green', label: t[lang].completed };
    if (status === 'In Progress') return { color: 'orange', label: t[lang].in_progress };
    return { color: 'slate', label: t[lang].pending };
  };

  // Skeleton Loader
  if (loading) return (
    <div className="min-h-screen bg-[#04080F] text-white p-6">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="glass-panel p-4 rounded-2xl h-16 animate-pulse bg-white/5"></div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => <div key={i} className="glass-panel p-4 rounded-xl h-24 animate-pulse bg-white/5"></div>)}
        </div>
        <div className="glass-panel rounded-2xl p-6 h-96 animate-pulse bg-white/5"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#04080F] text-white p-6 relative overflow-hidden">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a2333', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      <div className="fixed top-0 left-0 w-full h-full bg-dot-grid opacity-80 z-0"></div>
      <div className="fixed top-1/2 left-0 w-[300px] h-[300px] bg-cyan-600/20 rounded-full blur-[100px] z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center glass-panel-deep p-4 rounded-2xl border border-cyan-500/20 transition-all hover:border-cyan-400/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-black text-[#04080F] text-lg shadow-lg shadow-cyan-900/30 animate-float">K</div>
            <div>
              <h1 className="font-bold text-lg">{karigarData?.name || 'Loading...'}</h1>
              <p className="text-[10px] text-slate-400">ID: {karigarData?.id || '...'} • Active</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
             <LanguageSwitcher currentLang={lang} onLangChange={setLang} />
             <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Stats by Status */}
        <div className="grid grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-xl border border-white/5 hover:border-cyan-500/40 transition-all hover:-translate-y-1">
             <div className="text-[10px] text-slate-400 flex items-center gap-1"><Package className="w-3 h-3" /> {t[lang].assigned}</div>
             <div className="text-2xl font-bold text-cyan-400">{tasks.length}</div>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/5 hover:border-slate-500/40 transition-all hover:-translate-y-1">
             <div className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {t[lang].pending}</div>
             <div className="text-2xl font-bold text-slate-400">{tasks.filter(t => t.status === 'Pending').length}</div>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/5 hover:border-orange-500/40 transition-all hover:-translate-y-1">
             <div className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {t[lang].in_progress}</div>
             <div className="text-2xl font-bold text-orange-400">{tasks.filter(t => t.status === 'In Progress').length}</div>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/5 hover:border-green-500/40 transition-all hover:-translate-y-1">
             <div className="text-[10px] text-slate-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {t[lang].completed}</div>
             <div className="text-2xl font-bold text-green-400">{tasks.filter(t => t.status === 'Completed').length}</div>
          </div>
        </div>

        {/* Tasks */}
        <div className="glass-panel-deep rounded-2xl p-6 border border-white/10 shadow-xl hover:shadow-cyan-900/20 transition-all">
           <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-cyan-300"><CheckCircle2 className="w-4 h-4" /> {t[lang].todays_tasks}</h3>
           
           {tasks.length === 0 ? (
             <div className="text-center py-8 text-slate-500 text-sm">{t[lang].no_tasks}</div>
           ) : (
             <div className="space-y-4">
               {tasks.map((task) => {
                 const statusConfig = getStatusConfig(task.status);
                 return (
                   <div 
                     key={task.id} 
                     className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-cyan-400/30 transition-all hover:bg-white/5"
                   >
                     <div className="flex-1">
                        <div className="text-sm font-semibold flex items-center gap-2">
                          {task.title}
                          {task.rate > 0 && (
                            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                              ₹{task.rate}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-1">
                           <span className={`w-1.5 h-1.5 rounded-full bg-${statusConfig.color}-400`}></span> {statusConfig.label}
                           <span className="text-[8px] text-slate-600 ml-2"><Calendar className="w-3 h-3 inline" /> {new Date(task.created_at).toLocaleDateString()}</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 flex-wrap mt-2 md:mt-0">
                        <div className="relative">
                          <select
                            value={task.status}
                            onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                            className="bg-[#0A1025] border border-white/10 rounded-lg text-xs px-3 py-1.5 text-white outline-none focus:border-cyan-400 transition appearance-none cursor-pointer min-w-[120px]"
                          >
                            <option value="Pending">{t[lang].pending}</option>
                            <option value="In Progress">{t[lang].in_progress}</option>
                            <option value="Completed">{t[lang].completed}</option>
                          </select>
                        </div>
                        
                        {task.status !== 'Completed' && (
                          <button onClick={() => fileInputRefs.current[task.id]?.click()} className="bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold border border-cyan-500/20 transition flex items-center gap-1 hover:scale-105" disabled={uploadingFile === task.id}>
                            {uploadingFile === task.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                            {uploadingFile === task.id ? t[lang].uploading : t[lang].upload_proof}
                          </button>
                        )}
                        <input type="file" ref={(el) => { fileInputRefs.current[task.id] = el; }} className="hidden" accept="image/*,video/*,application/pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadFile(task.id, file); }} />
                        
                        <button 
                          onClick={() => deleteTask(task.id, task.title)}
                          disabled={deletingTask === task.id}
                          className="text-slate-500 hover:text-red-400 transition disabled:opacity-50"
                          title="Delete Task"
                        >
                          {deletingTask === task.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                        </button>
                     </div>
                   </div>
                 );
               })}
             </div>
           )}
        </div>

        {/* Chat */}
        <div className="glass-panel-deep rounded-2xl p-6 border border-white/10 shadow-xl hover:shadow-purple-900/20 transition-all">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold flex items-center gap-2 text-purple-300"><MessageSquare className="w-4 h-4" /> {t[lang].chat_owner}</h3>
              <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full text-[8px] border border-green-500/20">{t[lang].online}</span>
           </div>
           <div className="glass-panel p-3 rounded-xl border border-white/5 h-28 overflow-y-auto text-xs text-slate-400 mb-3 flex flex-col gap-1 hide-scrollbar">
              {messages.length === 0 && <p className="text-slate-600 text-center">{t[lang].no_messages}</p>}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.sender_id === karigarData?.id ? 'items-end' : 'items-start'}`}>
                   <div className={`glass-panel p-2 rounded-xl max-w-[80%] ${msg.sender_id === karigarData?.id ? 'bg-cyan-600/20 border-cyan-500/30' : 'bg-purple-600/20 border-purple-500/30'}`}>
                      <div className={msg.sender_id === karigarData?.id ? 'text-cyan-300' : 'text-purple-300'}>
                         <span className="font-bold">{msg.sender_id === karigarData?.id ? 'You' : 'Owner'}:</span> {msg.content}
                      </div>
                   </div>
                   <span className="text-[8px] text-slate-600 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</span>
                </div>
              ))}
           </div>
           <div className="flex gap-2">
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="flex-1 bg-[#0A1025] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-purple-500 transition placeholder:text-slate-600" />
              <button onClick={sendMessage} disabled={chatLoading || !newMessage.trim()} className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl text-sm transition shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 hover:scale-105">
                {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {t[lang].send}
              </button>
           </div>
        </div>

      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="glass-panel-deep rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl relative animate-slide-up">
             <button onClick={() => setSelectedTask(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition"><X className="w-5 h-5" /></button>
             <h3 className="text-xl font-bold mb-4 text-white">{t[lang].task_details}</h3>
             <div className="space-y-3">
                <div><span className="text-sm text-slate-400">Title:</span> <p className="text-lg font-semibold">{selectedTask.title}</p></div>
                <div><span className="text-sm text-slate-400">{t[lang].description}:</span> <p className="text-sm text-slate-300">{selectedTask.description || 'No description'}</p></div>
                <div><span className="text-sm text-slate-400">{t[lang].status}:</span> <span className={`text-sm font-medium px-2 py-1 rounded-full bg-${selectedTask.status === 'Completed' ? 'green' : selectedTask.status === 'In Progress' ? 'orange' : 'slate'}-500/20 text-${selectedTask.status === 'Completed' ? 'green' : selectedTask.status === 'In Progress' ? 'orange' : 'slate'}-300`}>{selectedTask.status}</span></div>
                {selectedTask.proof_url && (
                  <div>
                    <span className="text-sm text-slate-400">Proof:</span>
                    <div className="mt-2">
                      <a href={selectedTask.proof_url} target="_blank" rel="noopener noreferrer" className="inline-block text-cyan-400 hover:underline text-sm">📎 View Uploaded Proof</a>
                      <img src={selectedTask.proof_url} alt="Uploaded Proof" className="mt-2 max-h-40 rounded-lg border border-white/10 object-contain" />
                    </div>
                  </div>
                )}
             </div>
             <div className="mt-6 flex justify-end">
                <button onClick={() => setSelectedTask(null)} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm text-white transition">{t[lang].close}</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}