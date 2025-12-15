// stores/visitor.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface VisitorState {
  visitorId: string | null
  setVisitorId: (id: string) => void
  clearVisitorId: () => void
}

export const useVisitorStore = create<VisitorState>()(
  persist(
    set => ({
      visitorId: null,

      setVisitorId: (id: string) => {
        set({ visitorId: id })
      },

      clearVisitorId: () => {
        set({ visitorId: null })
      },
    }),
    {
      name: 'talkcrm_visitor',
      partialize: state => ({ visitorId: state.visitorId }),
    },
  ),
)
