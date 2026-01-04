import { create } from "zustand"

type ProcessingState ={
    isProcessing: boolean
    meetingId: number | null
    startProcessing: () =>void
    finishProcessing: (id:number) =>void
}

export const useProcessingStore = create<ProcessingState> ((set) => ({
    isProcessing: false,
    meetingId: null,

    startProcessing: () =>
        set({ isProcessing: true, meetingId: null }),

    finishProcessing: (id:number) =>
        set({ isProcessing: false, meetingId: id }),
}))