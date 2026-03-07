import { create } from 'zustand';
import type { AgentMessage, AgentStatus } from '@/types';
import { PLACEHOLDER_AGENT_MESSAGES } from '@/lib/placeholder-data';

interface AgentSlice {
  messages: AgentMessage[];
  status: AgentStatus;
  addMessage: (msg: AgentMessage) => void;
  setStatus: (s: AgentStatus) => void;
  clearHistory: () => void;
}

export const useAgentStore = create<AgentSlice>((set) => ({
  messages: PLACEHOLDER_AGENT_MESSAGES,
  status: 'online',
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setStatus: (status) => set({ status }),
  clearHistory: () => set({ messages: [] }),
}));
