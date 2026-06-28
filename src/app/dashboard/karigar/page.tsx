"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, Clock, ImageIcon, MessageSquare, LogOut, 
  Package, Loader2, Send, X, Calendar, Upload, Filter
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
  const [karigarData, setKarigarData] = useState<{id: string, name: string, owner_id: string} | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
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

  // === 4. Status Actions ===
  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    setUpdating(taskId);
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
    setUpdating(null);
    if (error) toast.error('Error updating status');
    else toast.success('Task marked as ' + newStatus);
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

  const handleLogout = () => { 
    document.cookie = "worksetu_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"; 
    router.push('/login'); 
  };

  // === 5. Translation Data (with proper typing) ===
  const t = {
    en: {
      assigned: 'Assigned',
      in_progress: 'In Progress',
      pending: 'Pending',
      completed: 'Completed',
      todays_tasks: "Today's Tasks",
      upload_proof: 'Upload Proof',
      mark_complete: 'Mark Complete',
      start_work: 'Start Work',
      chat_owner: 'Chat with Owner',
      online: 'Online',
      waiting: 'Waiting for materials',
      send: 'Send',
      uploading: 'Uploading...',
      no_tasks: 'No tasks assigned yet.',
      no_messages: 'No messages yet.',
      task_details: 'Task Details',
      status: 'Status',
      description: 'Description',
      close: 'Close',
      filter_all: 'All',
      filter_pending: 'Pending',
      filter_in_progress: 'In Progress',
      filter_completed: 'Completed'
    },
    gu: {
      assigned: 'અસાઈન કરેલ',
      in_progress: 'ચાલુ કામ',
      pending: 'પેન્ડિંગ',
      completed: 'પૂર્ણ',
      todays_tasks: "આજના કામ",
      upload_proof: 'પુરાવો મૂકો',
      mark_complete: 'પૂર્ણ કરો',
      start_work: 'શરૂ કરો',
      chat_owner: 'ઓનર સાથે ચેટ કરો',
      online: 'ઑનલાઇન',
      waiting: 'સાધનોની રાહ જુઓ',
      send: 'મોકલો',
      uploading: 'અપલોડ થઈ રહ્યું...',
      no_tasks: 'હજુ કોઈ કામ અસાઈન થયું નથી.',
      no_messages: 'હજુ કોઈ મેસેજ નથી.',
      task_details: 'કામની વિગતો',
      status: 'સ્થિતિ',
      description: 'વર્ણન',
      close: 'બંધ કરો',
      filter_all: 'બધા',
      filter_pending: 'પેન્ડિંગ',
      filter_in_progress: 'ચાલુ',
      filter_completed: 'પૂર્ણ'
    },
    hi: {
      assigned: 'असाइन किया गया',
      in_progress: 'प्रगति पर',
      pending: 'लंबित',
      completed: 'पूर्ण',
      todays_tasks: "आज के कार्य",
      upload_proof: 'प्रमाण अपलोड करें',
      mark_complete: 'पूर्ण करें',
      start_work: 'शुरू करें',
      chat_owner: 'मालिक से चैट करें',
      online: 'ऑनलाइन',
      waiting: 'सामग्री की प्रतीक्षा',
      send: 'भेजें',
      uploading: 'अपलोड हो रहा है...',
      no_tasks: 'अभी कोई कार्य असाइन नहीं हुआ।',
      no_messages: 'अभी कोई संदेश नहीं।',
      task_details: 'कार्य विवरण',
      status: 'स्थिति',
      description: 'विवरण',
      close: 'बंद करें',
      filter_all: 'सभी',
      filter_pending: 'लंबित',
      filter_in_progress: 'प्रगति पर',
      filter_completed: 'पूर्ण'
    }
  };

  // Helper to get translation safely
  const getTranslation = (key: keyof typeof t.en) => t[lang][key];

  const getStatusConfig = (status: string) => {
    if (status === 'Completed') return { color: 'green', label: getTranslation('completed') };
    if (status === 'In Progress') return { color: 'orange', label: getTranslation('in_progress') };
    return { color: 'slate', label: getTranslation('pending') };
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (statusFilter === 'all') return true;
    return task.status === statusFilter;
  });

  const totalTasks = tasks.length;
  const pendingCount = tasks.filter(t => t.status === 'Pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  // Status to translation key mapping
  const statusKeyMap: Record<string, keyof typeof t.en> = {
    'all': 'filter_all',
    'Pending': 'filter_pending',
    'In Progress': 'filter_in_progress',
    'Completed': 'filter_completed'
  };

  if (loading) return (
    <div className="min-h-screen bg-[#04080F] flex items-center justify-center text-cyan-400">
      <Loader2 className="w-10 h-10 animate-spin" />
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
             <div className="text-[10px] text-slate-400 flex items-center gap-1"><Package className="w-3 h-3" /> {getTranslation('assigned')}</div>
             <div className="text-2xl font-bold text-cyan-400">{totalTasks}</div>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/5 hover:border-slate-500/40 transition-all hover:-translate-y-1">
             <div className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {getTranslation('pending')}</div>
             <div className="text-2xl font-bold text-slate-400">{pendingCount}</div>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/5 hover:border-orange-500/40 transition-all hover:-translate-y-1">
             <div className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {getTranslation('in_progress')}</div>
             <div className="text-2xl font-bold text-orange-400">{inProgressCount}</div>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/5 hover:border-green-500/40 transition-all hover:-translate-y-1">
             <div className="text-[10px] text-slate-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {getTranslation('completed')}</div>
             <div className="text-2xl font-bold text-green-400">{completedCount}</div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 glass-panel-deep p-4 rounded-2xl border border-white/10 shadow-xl">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-2"><Filter className="w-3 h-3" /> Filter:</span>
          {['all', 'Pending', 'In Progress', 'Completed'].map(status => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${statusFilter === status ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
            >
              {getTranslation(statusKeyMap[status])}
            </button>
          ))}
        </div>

        {/* Tasks */}
        <div className="glass-panel-deep rounded-2xl p-6 border border-white/10 shadow-xl hover:shadow-cyan-900/20 transition-all">
           <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-cyan-300"><CheckCircle2 className="w-4 h-4" /> {getTranslation('todays_tasks')}</h3>
           
           {loading ? (
             <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-cyan-400 animate-spin" /></div>
           ) : filteredTasks.length === 0 ? (
             <div className="text-center py-8 text-slate-500 text-sm">{getTranslation('no_tasks')}</div>
           ) : (
             <div className="space-y-4">
               {filteredTasks.map((task) => {
                 const statusConfig = getStatusConfig(task.status);
                 return (
                   <div 
                     key={task.id} 
                     onClick={() => setSelectedTask(task)}
                     className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-cyan-400/30 transition-all cursor-pointer hover:bg-white/5"
                   >
                     <div>
                        <div className="text-sm font-semibold">{task.title}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-1">
                           <span className={`w-1.5 h-1.5 rounded-full bg-${statusConfig.color}-400`}></span> {statusConfig.label}
                           <span className="text-[8px] text-slate-600"><Calendar className="w-3 h-3 inline" /> {new Date(task.created_at).toLocaleDateString()}</span>
                        </div>
                     </div>
                     <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                        {task.status === 'Pending' && (
                          <button 
                            onClick={() => updateTaskStatus(task.id, 'In Progress')}
                            disabled={updating === task.id}
                            className="bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold border border-cyan-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 hover:scale-105"
                          >
                            {updating === task.id ? <Loader2 className="w-3 h-3 animate-spin" /> : '▶️'}
                            {getTranslation('start_work')}
                          </button>
                        )}
                        {task.status === 'In Progress' && (
                          <>
                            <button onClick={() => fileInputRefs.current[task.id]?.click()} className="bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold border border-cyan-500/20 transition flex items-center gap-1 hover:scale-105" disabled={uploadingFile === task.id}>
                              {uploadingFile === task.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                              {uploadingFile === task.id ? getTranslation('uploading') : getTranslation('upload_proof')}
                            </button>
                            <input type="file" ref={(el) => { fileInputRefs.current[task.id] = el; }} className="hidden" accept="image/*,video/*,application/pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadFile(task.id, file); }} />
                            <button 
                              onClick={() => updateTaskStatus(task.id, 'Completed')}
                              disabled={updating === task.id}
                              className="bg-green-600/20 hover:bg-green-600 text-green-300 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold border border-green-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 hover:scale-105"
                            >
                              {updating === task.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                              {getTranslation('mark_complete')}
                            </button>
                          </>
                        )}
                        {task.status === 'Completed' && (
                          <span className="text-green-400 text-[10px] font-medium">✅ {getTranslation('completed')}</span>
                        )}
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
              <h3 className="text-sm font-bold flex items-center gap-2 text-purple-300"><MessageSquare className="w-4 h-4" /> {getTranslation('chat_owner')}</h3>
              <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full text-[8px] border border-green-500/20">{getTranslation('online')}</span>
           </div>
           <div className="glass-panel p-3 rounded-xl border border-white/5 h-28 overflow-y-auto text-xs text-slate-400 mb-3 flex flex-col gap-1 hide-scrollbar">
              {messages.length === 0 && <p className="text-slate-600 text-center">{getTranslation('no_messages')}</p>}
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
                {getTranslation('send')}
              </button>
           </div>
        </div>

      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="glass-panel-deep rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl relative animate-slide-up">
             <button onClick={() => setSelectedTask(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition"><X className="w-5 h-5" /></button>
             <h3 className="text-xl font-bold mb-4 text-white">{getTranslation('task_details')}</h3>
             <div className="space-y-3">
                <div><span className="text-sm text-slate-400">Title:</span> <p className="text-lg font-semibold">{selectedTask.title}</p></div>
                <div><span className="text-sm text-slate-400">{getTranslation('description')}:</span> <p className="text-sm text-slate-300">{selectedTask.description || 'No description'}</p></div>
                <div><span className="text-sm text-slate-400">{getTranslation('status')}:</span> <span className={`text-sm font-medium px-2 py-1 rounded-full bg-${selectedTask.status === 'Completed' ? 'green' : selectedTask.status === 'In Progress' ? 'orange' : 'slate'}-500/20 text-${selectedTask.status === 'Completed' ? 'green' : selectedTask.status === 'In Progress' ? 'orange' : 'slate'}-300`}>{selectedTask.status}</span></div>
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
                <button onClick={() => setSelectedTask(null)} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm text-white transition">{getTranslation('close')}</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}