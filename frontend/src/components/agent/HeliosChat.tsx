import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { useAgentStore } from '@/store/agentSlice';
import { useUIStore } from '@/store/uiSlice';
import { ResponseBlockRenderer } from './ResponseBlocks';
import type { AgentMessage, AgentResponseBlock } from '@/types';

const ThinkingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    className="flex items-center gap-2 px-3 py-2"
  >
    <motion.div className="flex items-center gap-1">
      <Sparkles className="w-3 h-3 text-primary" />
      <span className="font-mono text-[10px] text-primary tracking-wider">THINKING</span>
    </motion.div>
    <div className="flex gap-1">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1 h-1 rounded-full bg-primary"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  </motion.div>
);

const MessageBubble = ({ msg }: { msg: AgentMessage }) => {
  const isUser = msg.role === 'user';
  const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
    >
      <div className={`max-w-[95%] ${isUser ? 'bg-primary/10 border-primary/20' : 'bg-transparent'} ${isUser ? 'rounded border px-3 py-2' : ''}`}>
        {isUser ? (
          <p className="text-[12px] text-foreground">{msg.content as string}</p>
        ) : (
          <motion.div
            className="space-y-2"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {(msg.content as AgentResponseBlock[]).map((block, i) => (
              <ResponseBlockRenderer key={i} block={block} />
            ))}
          </motion.div>
        )}
      </div>
      <span className="font-mono text-[9px] text-muted-foreground mt-1 px-1">{time}</span>
    </motion.div>
  );
};

export const HeliosChat = () => {
  const { messages, status, addMessage, setStatus } = useAgentStore();
  const { heliosStream, setHeliosStream } = useUIStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: AgentMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);
    setInput('');
    setStatus('thinking');

    // Simulated agent response after delay
    setTimeout(() => {
      const agentMsg: AgentMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'agent',
        content: [
          { type: 'text_block', payload: { text: `Processing your request: **"${userMsg.content}"**. This is a simulated response — live HELIOS integration coming in Phase 5.` } },
        ],
        timestamp: new Date().toISOString(),
      };
      addMessage(agentMsg);
      setStatus('online');
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Stream toggle header */}
      <div className="px-3 py-2 border-b border-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <motion.span
            className="w-2 h-2 rounded-full bg-[hsl(var(--hip-green))]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="font-mono text-[10px] text-muted-foreground">ONLINE · Last updated 14s ago</span>
        </div>
        <div className="flex gap-1">
          {(['A', 'B'] as const).map(s => (
            <button
              key={s}
              onClick={() => setHeliosStream(s)}
              className={`font-mono text-[9px] tracking-wider px-2 py-0.5 rounded-sm border transition-colors ${
                heliosStream === s ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
              }`}
            >
              STREAM {s}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        <AnimatePresence>
          {status === 'thinking' && <ThinkingIndicator />}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border flex-shrink-0">
        <form
          onSubmit={e => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2 bg-card rounded border border-border px-3 py-2 focus-within:border-primary/40 transition-colors"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask HELIOS..."
            className="flex-1 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="text-primary disabled:text-muted-foreground transition-colors hover:text-primary/80"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[9px] text-muted-foreground">⌘↵</span>
        </form>
      </div>
    </div>
  );
};
