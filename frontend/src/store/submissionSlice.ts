import { create } from 'zustand';
import type { UserSubmission } from '@/types';

interface SubmissionSlice {
  submissions: UserSubmission[];
  pendingCount: number;
  setSubmissions: (s: UserSubmission[]) => void;
  upsertSubmission: (s: UserSubmission) => void;
  setPendingCount: (n: number) => void;
}

export const useSubmissionStore = create<SubmissionSlice>((set) => ({
  submissions: [],
  pendingCount: 0,
  setSubmissions: (submissions) => set({ submissions }),
  upsertSubmission: (s) => set((state) => {
    const idx = state.submissions.findIndex(x => x.id === s.id);
    if (idx >= 0) {
      const updated = [...state.submissions];
      updated[idx] = s;
      return { submissions: updated };
    }
    return { submissions: [s, ...state.submissions] };
  }),
  setPendingCount: (n) => set({ pendingCount: n }),
}));
