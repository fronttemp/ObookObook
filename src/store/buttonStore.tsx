import create from 'zustand';

export const useHandleAddResultsClick = create((set) => ({
  maxResults: 10,
  handleAddResultsClick: (newMaxResults: number) => set({ maxResults: newMaxResults }),
}));