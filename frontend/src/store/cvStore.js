import { create } from 'zustand'

export const useCVStore = create((set) => ({
  cvList:     [],
  currentCV:  null,
  isDirty:    false,    // unsaved changes flag

  setCVList:   (cvList)    => set({ cvList }),
  setCurrentCV:(cv)        => set({ currentCV: cv, isDirty: false }),
  updateField: (field, value) =>
    set((state) => ({
      currentCV: { ...state.currentCV, [field]: value },
      isDirty: true,
    })),
  markSaved:   ()          => set({ isDirty: false }),
  resetCV:     ()          => set({ currentCV: null, isDirty: false }),
}))
