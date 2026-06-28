"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, Clock, ImageIcon, MessageSquare, LogOut, 
  Package, Loader2, Send, Users, Plus, RefreshCw,
  Briefcase, UserPlus, X, Calendar, LayoutGrid, List
} from 'lucide-react';
import { createClient } from '@/lib/supabase.client';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import OnboardingWizard from '@/components/OnboardingWizard';
import { toast, Toaster } from 'react-hot-toast';

export default function OwnerDashboard() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'gu' | 'hi'>('en');
  const [loading, setLoading] = useState(true);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [ownerProfile, setOwnerProfile] = useState<any>(null);
  
  // Data States
  const [ownerData, setOwnerData] = useState<{id: string, name: string, businessName: string} | null>(null);
  const [karigars, setKarigars] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'karigars' | 'all' | 'inprogress' | 'completed'>('karigars');

  // Chat Selection
  const [chattingWith, setChattingWith] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Modals & Forms
  const [showAddKarigar, setShowAddKarigar] = useState(false);
  const [newKarigarName, setNewKarigarName] = useState('');
  const [addingKarigar, setAddingKarigar] = useState(false);

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [selectedKarigarForTask, setSelectedKarigarForTask] = useState('');
  const [addingTask, setAddingTask] = useState(false);

  const supabase = createClient();

  // === 1. Owner Session Fetch & Onboarding Check ===
  useEffect(() => {
    const load = async () => {
      let sessionUser: any = null;

      if (process.env.NODE_ENV === 'development') {
        const dummyId = 'owner_dev_123';
        setOwnerData({ id: dummyId, name: 'Dev Owner', businessName: 'My Workshop' });
        sessionUser = { id: dummyId };
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.push('/login'); return; }
        setOwnerData({ id: session.user.id, name: session.user.email || 'Owner', businessName: '' });
        sessionUser = session.user;
      }

      if (sessionUser) {
        const { data: profile, error } = await supabase
          .from('owners')
          .select('*')
          .eq('id', sessionUser.id)
          .single();

        if (profile && profile.onboarding_completed) {
          setOwnerProfile(profile);
          setOwnerData(prev => prev ? { ...prev, businessName: profile.business_name } : null);
          setIsOnboarding(false);
        } else {
          setIsOnboarding(true);
        }
      }
      setLoading(false);
    };
    load();
  }, [router, supabase, isOnboarding]);

  // === 2. Fetch Data & Realtime ===
  const fetchData = async () => {
    if (!ownerData || isOnboarding) return;
    const [karigarsRes, tasksRes] = await Promise.all([
      supabase.from('karigars').select('*').eq('owner_id', ownerData.id),
      supabase.from('tasks').select('*').eq('owner_id', ownerData.id).order('created_at', { ascending: false })
    ]);
    if (!karigarsRes.error) setKarigars(karigarsRes.data || []);
    if (!tasksRes.error) setTasks(tasksRes.data || []);
  };

  useEffect(() => {
    if (!ownerData || isOnboarding) return;
    fetchData();

    const kChannel = supabase.channel('owner-karigars')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'karigars', filter: `owner_id=eq.${ownerData.id}` }, fetchData)
      .subscribe();

    const tChannel = supabase.channel('owner-tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `owner_id=eq.${ownerData.id}` }, fetchData)
      .subscribe();

    return () => { supabase.removeChannel(kChannel); supabase.removeChannel(tChannel); };
  }, [ownerData, isOnboarding]);

  // === 3. Chat System ===
  useEffect(() => {
    if (!ownerData || !chattingWith || isOnboarding) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${ownerData.id},receiver_id.eq.${ownerData.id}`)
        .or(`sender_id.eq.${chattingWith},receiver_id.eq.${chattingWith}`)
        .order('created_at', { ascending: true });
      if (!error) setMessages(data || []);
    };
    loadMessages();

    const channel = supabase.channel(`chat-${chattingWith}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload: { new: any }) => {
          if ((payload.new.sender_id === chattingWith && payload.new.receiver_id === ownerData.id) ||
              (payload.new.sender_id === ownerData.id && payload.new.receiver_id === chattingWith)) {
            setMessages((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [chattingWith, ownerData, isOnboarding]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !ownerData || !chattingWith) return;
    setChatLoading(true);
    const { error } = await supabase.from('messages').insert({
      sender_id: ownerData.id, receiver_id: chattingWith, content: newMessage
    });
    setChatLoading(false);
    if (!error) setNewMessage('');
    else toast.error('Failed to send');
  };

  // === 4. Actions ===
  const addKarigar = async () => {
    if (!newKarigarName.trim() || !ownerData) return;
    setAddingKarigar(true);
    const res = await fetch('/api/auth/add-karigar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner_id: ownerData.id, name: newKarigarName })
    });
    const data = await res.json();
    setAddingKarigar(false);
    if (data.success) {
      toast.success(`✅ Karigar added!\nID: ${data.karigarId}\nPIN: ${data.pin}`);
      setNewKarigarName('');
      setShowAddKarigar(false);
      await fetchData();
    } else {
      toast.error('Error: ' + data.error);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim() || !selectedKarigarForTask || !ownerData) return;
    setAddingTask(true);
    const { error } = await supabase.from('tasks').insert({
      owner_id: ownerData.id,
      karigar_id: selectedKarigarForTask,
      title: newTaskTitle,
      description: newTaskDesc,
      status: 'Pending'
    });
    setAddingTask(false);
    if (error) toast.error('Error: ' + error.message);
    else {
      toast.success('Task assigned successfully!');
      setShowAddTask(false);
      setNewTaskTitle('');
      setNewTaskDesc('');
      setSelectedKarigarForTask('');
    }
  };

  const resetKarigarPin = async (karigarId: string, karigarName: string) => {
    if(!confirm(`Are you sure you want to reset PIN for ${karigarName}?`)) return;
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    const pin_hash = await import('bcryptjs').then(mod => mod.hashSync(newPin, 10));
    const { error } = await supabase.from('karigars').update({ pin_hash }).eq('id', karigarId);
    if (error) toast.error('Failed to reset PIN');
    else toast.success(`✅ PIN reset!\nNew PIN: ${newPin}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = "worksetu_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"; 
    router.push('/login'); 
  };

  // === 5. Translation Data ===
  const t = {
    en: { overview: 'Overview', karigars: 'Karigars', tasks: 'Tasks', chat: 'Chat', total_karigars: 'Total Karigars', total_tasks: 'Total Tasks', in_progress: 'In Progress', completed: 'Completed', add_karigar: 'Add New Karigar', add_task: 'Assign New Task', select_karigar: 'Select a Karigar', task_title: 'Task Title', task_desc: 'Description', send: 'Send', reset_pin: 'Reset PIN', no_karigar_selected: 'Select a Karigar to chat', online: 'Online', loading: 'Loading...', task_details: 'Task Details', status: 'Status', assigned_to: 'Assigned to', close: 'Close', all: 'All Tasks' },
    gu: { overview: 'ઝાંખી', karigars: 'કારીગરો', tasks: 'કામો', chat: 'ચેટ', total_karigars: 'કુલ કારીગરો', total_tasks: 'કુલ કામો', in_progress: 'ચાલુ કામ', completed: 'પૂર્ણ થયેલ', add_karigar: 'નવો કારીગર ઉમેરો', add_task: 'નવું કામ અસાઈન કરો', select_karigar: 'કારીગર પસંદ કરો', task_title: 'કામનું શીર્ષક', task_desc: 'વર્ણન', send: 'મોકલો', reset_pin: 'PIN રીસેટ કરો', no_karigar_selected: 'ચેટ કરવા માટે કારીગર પસંદ કરો', online: 'ઑનલાઇન', loading: 'લોડ થાય છે...', task_details: 'કામની વિગતો', status: 'સ્થિતિ', assigned_to: 'અસાઈન કરેલ', close: 'બંધ કરો', all: 'બધા કામો' },
    hi: { overview: 'अवलोकन', karigars: 'कारीगर', tasks: 'कार्य', chat: 'चैट', total_karigars: 'कुल कारीगर', total_tasks: 'कुल कार्य', in_progress: 'प्रगति पर', completed: 'पूर्ण', add_karigar: 'नया कारीगर जोड़ें', add_task: 'नया कार्य असाइन करें', select_karigar: 'कारीगर चुनें', task_title: 'कार्य का शीर्षक', task_desc: 'विवरण', send: 'भेजें', reset_pin: 'PIN रीसेट करें', no_karigar_selected: 'चैट करने के लिए कारीगर चुनें', online: 'ऑनलाइन', loading: 'लोड हो रहा है...', task_details: 'कार्य विवरण', status: 'स्थिति', assigned_to: 'असाइन किया गया', close: 'बंद करें', all: 'सभी कार्य' }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#04080F] flex items-center justify-center text-cyan-400">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );

  if (isOnboarding && ownerData) {
    return <OnboardingWizard userId={ownerData.id} onComplete={() => setIsOnboarding(false)} />;
  }

  // Filter tasks for tab views
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  // Determine what to display based on activeTab
  let displayList: any[] = [];
  let listType: 'karigars' | 'tasks' = 'tasks';
  if (activeTab === 'karigars') {
    displayList = karigars;
    listType = 'karigars';
  } else if (activeTab === 'all') {
    displayList = tasks;
  } else if (activeTab === 'inprogress') {
    displayList = inProgressTasks;
  } else if (activeTab === 'completed') {
    displayList = completedTasks;
  }

  return (
    <div className="min-h-screen bg-[#04080F] text-white p-6 relative overflow-hidden">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a2333', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      <div className="fixed top-0 left-0 w-full h-full bg-dot-grid opacity-80 z-0"></div>
      <div className="fixed top-1/2 left-0 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[100px] z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        
        {/* Header with Business Name */}
        <div className="flex justify-between items-center glass-panel-deep p-4 rounded-2xl border border-purple-500/20 transition-all hover:border-purple-400/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center font-black text-[#04080F] text-lg shadow-lg shadow-purple-900/30 animate-float">O</div>
            <div>
              <h1 className="font-bold text-lg">{ownerData?.businessName || 'Workshop'}</h1>
              <p className="text-[10px] text-slate-400">Control Center</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
             <LanguageSwitcher currentLang={lang} onLangChange={setLang} />
             <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="glass-panel-deep p-2 rounded-2xl border border-white/10 shadow-xl flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveTab('karigars')}
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'karigars' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Users className="w-4 h-4 inline mr-1" /> {t[lang].karigars} ({karigars.length})
          </button>
          <button 
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutGrid className="w-4 h-4 inline mr-1" /> {t[lang].all} ({tasks.length})
          </button>
          <button 
            onClick={() => setActiveTab('inprogress')}
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'inprogress' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Clock className="w-4 h-4 inline mr-1" /> {t[lang].in_progress} ({inProgressTasks.length})
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'completed' ? 'bg-green-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <CheckCircle2 className="w-4 h-4 inline mr-1" /> {t[lang].completed} ({completedTasks.length})
          </button>
        </div>

        {/* List Display Area */}
        <div className="glass-panel-deep rounded-2xl p-6 border border-white/10 shadow-xl min-h-[300px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white">
              {activeTab === 'karigars' ? t[lang].karigars : 
               activeTab === 'all' ? t[lang].all :
               activeTab === 'inprogress' ? t[lang].in_progress : t[lang].completed}
            </h3>
            {activeTab === 'karigars' && (
              <button onClick={() => setShowAddKarigar(true)} className="bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold border border-purple-500/20 transition flex items-center gap-1 hover:scale-105">
                <UserPlus className="w-3 h-3" /> {t[lang].add_karigar}
              </button>
            )}
            {activeTab === 'all' && (
              <button onClick={() => setShowAddTask(true)} className="bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold border border-cyan-500/20 transition flex items-center gap-1 hover:scale-105">
                <Plus className="w-3 h-3" /> {t[lang].add_task}
              </button>
            )}
          </div>

          {/* Render list */}
          {displayList.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              {activeTab === 'karigars' ? 'No karigars added yet.' : 
               activeTab === 'all' ? 'No tasks created yet.' :
               activeTab === 'inprogress' ? 'No tasks in progress.' : 'No completed tasks.'}
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto hide-scrollbar pr-1">
              {listType === 'karigars' ? (
                displayList.map(k => (
                  <div key={k.id} onClick={() => setChattingWith(k.id)} className="glass-panel p-3 rounded-xl border border-white/5 hover:border-purple-400/50 transition-all cursor-pointer flex items-center justify-between hover:scale-[1.01]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold">{k.name.charAt(0)}</div>
                      <div>
                        <div className="text-sm font-medium">{k.name}</div>
                        <div className="text-[10px] text-slate-400">ID: {k.id}</div>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); resetKarigarPin(k.id, k.name); }} className="text-slate-500 hover:text-yellow-400 transition" title={t[lang].reset_pin}><RefreshCw className="w-3 h-3" /></button>
                  </div>
                ))
              ) : (
                displayList.map(task => {
                  const karigar = karigars.find(k => k.id === task.karigar_id);
                  const statusColor = task.status === 'Completed' ? 'green' : task.status === 'In Progress' ? 'orange' : 'slate';
                  return (
                    <div key={task.id} onClick={() => setSelectedTask(task)} className="glass-panel p-3 rounded-xl border border-white/5 hover:border-cyan-400/30 transition-all cursor-pointer hover:bg-white/5 flex justify-between items-center">
                      <div>
                        <div className="text-sm font-semibold">{task.title}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>Assigned to: <span className="text-purple-300">{karigar?.name || 'Unknown'}</span></span>
                          <span className={`w-1 h-1 rounded-full bg-${statusColor}-400`}></span>
                          <span className={`text-${statusColor}-300`}>{task.status}</span>
                          <span className="text-slate-600 text-[8px]"><Calendar className="w-3 h-3 inline" /> {new Date(task.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Chat Area (Right side - like previous, but now below list for simplicity) */}
        <div className="glass-panel-deep rounded-2xl p-6 border border-white/10 shadow-xl flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> {t[lang].chat}</h3>
            {chattingWith && <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full text-[8px] border border-green-500/20">{t[lang].online}</span>}
          </div>
          <div className="flex-1 overflow-y-auto text-xs text-slate-400 space-y-2 pr-1 mb-3 hide-scrollbar">
            {!chattingWith && <p className="text-slate-600 text-center py-10">{t[lang].no_karigar_selected}</p>}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender_id === ownerData?.id ? 'items-end' : 'items-start'}`}>
                <div className={`glass-panel p-2 rounded-xl max-w-[80%] ${msg.sender_id === ownerData?.id ? 'bg-purple-600/20 border-purple-500/30' : 'bg-cyan-600/20 border-cyan-500/30'}`}>
                  <div className={msg.sender_id === ownerData?.id ? 'text-cyan-300' : 'text-purple-300'}>
                    <span className="font-bold">{msg.sender_id === ownerData?.id ? 'You' : 'Karigar'}:</span> {msg.content}
                  </div>
                </div>
                <span className="text-[8px] text-slate-600 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} disabled={!chattingWith} placeholder={chattingWith ? "Type a message..." : "Select a Karigar first"} className="flex-1 bg-[#0A1025] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-purple-500 transition placeholder:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed" />
            <button onClick={sendMessage} disabled={chatLoading || !newMessage.trim() || !chattingWith} className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl text-sm transition shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 hover:scale-105">
              {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {t[lang].send}
            </button>
          </div>
        </div>

      </div>

      {/* Task Details Modal (unchanged) */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="glass-panel-deep rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl relative animate-slide-up">
            <button onClick={() => setSelectedTask(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-bold mb-4 text-white">{t[lang].task_details}</h3>
            <div className="space-y-3">
              <div><span className="text-sm text-slate-400">Title:</span> <p className="text-lg font-semibold">{selectedTask.title}</p></div>
              <div><span className="text-sm text-slate-400">{t[lang].task_desc}:</span> <p className="text-sm text-slate-300">{selectedTask.description || 'No description'}</p></div>
              <div><span className="text-sm text-slate-400">{t[lang].assigned_to}:</span> <p className="text-sm text-purple-300">{karigars.find(k => k.id === selectedTask.karigar_id)?.name || 'Unknown'}</p></div>
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

      {/* Modals for Add Karigar and Add Task - unchanged */}
      {showAddKarigar && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="glass-panel-deep rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl relative animate-slide-up">
            <button onClick={() => setShowAddKarigar(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-bold mb-4 text-white">{t[lang].add_karigar}</h3>
            <input type="text" value={newKarigarName} onChange={(e) => setNewKarigarName(e.target.value)} placeholder="Karigar Name" className="w-full bg-[#0A1025] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500 transition mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowAddKarigar(false)} className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl text-sm text-white transition">Cancel</button>
              <button onClick={addKarigar} disabled={addingKarigar} className="flex-1 bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-sm font-bold text-white shadow-lg shadow-purple-900/30 transition disabled:opacity-70 flex items-center justify-center gap-2 hover:scale-105">
                {addingKarigar ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Karigar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="glass-panel-deep rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl relative animate-slide-up">
            <button onClick={() => setShowAddTask(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-bold mb-4 text-white">{t[lang].add_task}</h3>
            <select value={selectedKarigarForTask} onChange={(e) => setSelectedKarigarForTask(e.target.value)} className="w-full bg-[#0A1025] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 transition mb-3">
              <option value="">{t[lang].select_karigar}</option>
              {karigars.map(k => <option key={k.id} value={k.id}>{k.name} ({k.id})</option>)}
            </select>
            <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder={t[lang].task_title} className="w-full bg-[#0A1025] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 transition mb-3" />
            <textarea value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)} placeholder={t[lang].task_desc} rows={3} className="w-full bg-[#0A1025] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 transition mb-4 resize-none"></textarea>
            <div className="flex gap-3">
              <button onClick={() => setShowAddTask(false)} className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl text-sm text-white transition">Cancel</button>
              <button onClick={addTask} disabled={addingTask} className="flex-1 bg-cyan-600 hover:bg-cyan-500 py-3 rounded-xl text-sm font-bold text-white shadow-lg shadow-cyan-900/30 transition disabled:opacity-70 flex items-center justify-center gap-2 hover:scale-105">
                {addingTask ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Assign Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}