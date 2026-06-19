import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Profile, Message } from '../types/database';
import { Send, ArrowLeft, Phone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="min-h-screen bg-surface-950 text-white flex">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-hero-gradient opacity-20" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Conversations Sidebar */}
      <div className={`w-full md:w-80 glass border-r border-surface-800/50 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-surface-800/50">
          <h1 className="text-xl font-bold text-white">Messages</h1>
        </div>
        <div className="flex-1 overflow-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-surface-500">
              <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map((c) => (
              <motion.button
                key={c.id}
                onClick={() => openChat(c.id)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-surface-800/50 transition-colors ${
                  activeChat?.id === c.id ? 'bg-primary-500/10 border-l-2 border-primary-500' : ''
                }`}
                whileHover={{ x: 4 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-glow">
                  <span className="text-white font-bold">{c.participant.full_name.charAt(0)}</span>
                </div>
                <div className="flex-1 text-left">
                  <span className="font-medium text-white">{c.participant.full_name}</span>
                </div>
                {c.unread > 0 && (
                  <span className="w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center shadow-glow">
                    {c.unread}
                  </span>
                )}
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        <AnimatePresence mode="wait">
          {activeChat ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {/* Chat Header */}
              <div className="glass p-4 border-b border-surface-800/50 flex items-center gap-3">
                <button onClick={() => setActiveChat(null)} className="md:hidden p-2 rounded-lg hover:bg-surface-800 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-surface-400" />
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-glow">
                  <span className="text-white font-bold">{activeChat.full_name.charAt(0)}</span>
                </div>
                <h2 className="font-semibold text-white">{activeChat.full_name}</h2>
                <Phone className="w-5 h-5 text-surface-500 ml-auto hover:text-primary-400 cursor-pointer transition-colors" />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-auto p-4 space-y-4 bg-surface-950/50">
                {messages.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex ${m.sender_id === user!.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      m.sender_id === user!.id
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow'
                        : 'glass text-white'
                    }`}>
                      <p className="text-sm leading-relaxed">{m.content}</p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="glass p-4 border-t border-surface-800/50">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 bg-surface-800/50 border border-surface-700 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none text-white placeholder:text-surface-500 transition-all"
                  />
                  <motion.button
                    onClick={sendMessage}
                    className="p-3 premium-button rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center bg-surface-950/50"
            >
              <div className="text-center text-surface-500">
                <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select a conversation</p>
                <p className="text-sm mt-1">or start a new one</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
