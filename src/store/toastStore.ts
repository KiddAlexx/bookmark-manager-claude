import { create } from "zustand"

export interface ToastItem {
  id: string
  message: string
  icon: React.ElementType
}

interface ToastStore {
  toasts: ToastItem[]
  addToast: (message: string, icon: React.ElementType) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  addToast: (message, icon) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`
    set((state) => ({ toasts: [...state.toasts, { id, message, icon }] }))
    setTimeout(() => get().removeToast(id), 4000)
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  },
}))
