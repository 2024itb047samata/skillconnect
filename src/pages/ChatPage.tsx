import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Profile, Message } from '../types/database';
import { Send, ArrowLeft, Phone, User } from 'lucide-react';

export default function ChatPage() {
  const { chatWithId } = useParams();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<{ id: string; participant: Profile; unread: number }[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChat, setActiveChat] = useState<Profile | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (user) fetchConversations(); }, [user]);
  useEffect(() => { if (chatWithId) openChat(chatWithId); else if (conversations.length > 0 && !activeChat) openChat(conversations[0].id); }, [chatWithId, conversations]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fetchConversations = async () => {
    const { data } = await supabase.from('messages').or(`sender_id.eq.${user!.id},receiver_id.eq.${user!.id}`).select('*, sender:profiles!messages_sender_id_fkey(*), receiver:profiles!messages_receiver_id_fkey(*)').order('created_at', { ascending: false });
    if (data) {
      const convMap = new Map<string, { participant: Profile; unread: number }>();
      for (const msg of data as Message[]) {
        const other = msg.sender_id === user!.id ? msg.receiver : msg.sender;
        if (!other) continue;
        if (!convMap.has(other.id)) convMap.set(other.id, { participant: other as Profile, unread: msg.receiver_id === user!.id && !msg.read_at ? 1 : 0 });
      }
      setConversations(Array.from(convMap.entries()).map(([id, v]) => ({ id, ...v })));
    }
    setLoading(false);
  };

  const openChat = async (participantId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', participantId).single();
    if (data) { setActiveChat(data as Profile); await fetchMessages(participantId); }
  };

  const fetchMessages = async (pid: string) => {
    const { data } = await supabase.from('messages').or(`and(sender_id.eq.${user!.id},receiver_id.eq.${pid}),and(sender_id.eq.${pid},receiver_id.eq.${user!.id})`).select('*, sender:profiles!messages_sender_id_fkey(*)').order('created_at', { ascending: true });
    if (data) setMessages(data as Message[]);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;
    const { data } = await supabase.from('messages').insert({ sender_id: user!.id, receiver_id: activeChat.id, content: newMessage.trim() }).select('*, sender:profiles!messages_sender_id_fkey(*)').single();
    if (data) { setMessages([...messages, data as Message]); setNewMessage(''); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors">
      <div className={`w-full md:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700"><h1 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h1></div>
        <div className="flex-1 overflow-auto">
          {conversations.length === 0 ? (<div className="p-8 text-center text-gray-500 dark:text-gray-400"><p>No conversations yet</p></div>) :
            conversations.map((c) => (
              <button key={c.id} onClick={() => openChat(c.id)} className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${activeChat?.id === c.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{c.participant.full_name.charAt(0)}</span>
                </div>
                <div className="flex-1 text-left">
                  <span className="font-medium text-gray-900 dark:text-white">{c.participant.full_name}</span>
                </div>
                {c.unread > 0 && (<span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">{c.unread}</span>)}
              </button>
            ))}
        </div>
      </div>

      <div className={`flex-1 flex flex-col ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <button onClick={() => setActiveChat(null)} className="md:hidden"><ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" /></button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{activeChat.full_name.charAt(0)}</span>
              </div>
              <h2 className="font-semibold text-gray-900 dark:text-white">{activeChat.full_name}</h2>
              <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400 ml-auto" />
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender_id === user!.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-2xl ${m.sender_id === user!.id ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'}`}>
                    <p className="text-sm">{m.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white dark:placeholder-gray-400" />
                <button onClick={sendMessage} className="p-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl"><Send className="w-5 h-5" /></button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900"><div className="text-center text-gray-500 dark:text-gray-400"><User className="w-16 h-16 mx-auto mb-4 opacity-50" /><p>Select a conversation</p></div></div>
        )}
      </div>
    </div>
  );
}
