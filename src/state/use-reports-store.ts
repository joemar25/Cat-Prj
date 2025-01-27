// src\state\use-reports-store.ts
import { create } from 'zustand'

interface ReportsState {
    birthData: { year: number; male: number; female: number }[]
    deathData: { year: number; male: number; female: number }[]
    marriageData: { year: number; totalMarriages: number; residents: number; nonResidents: number }[]
    loading: boolean
    error: string | null
    fetchBirthData: (startYear: number, endYear: number) => Promise<void>
    fetchDeathData: (startYear: number, endYear: number) => Promise<void>
    fetchMarriageData: (startYear: number, endYear: number) => Promise<void>
}

export const useReportsStore = create<ReportsState>((set) => ({
    birthData: [],
    deathData: [],
    marriageData: [],
    loading: false,
    error: null,
    fetchBirthData: async (startYear, endYear) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`/api/reports/birth?startYear=${startYear}&endYear=${endYear}`)
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            const data = await response.json()
            if (data.error) throw new Error(data.error)
            set({ birthData: data, loading: false })
        } catch (error) {
            console.error('Birth data fetch error:', error)
            set({ error: error instanceof Error ? error.message : 'Failed to fetch birth data', loading: false })
        }
    },
    fetchDeathData: async (startYear, endYear) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`/api/reports/death?startYear=${startYear}&endYear=${endYear}`)
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            const data = await response.json()
            if (data.error) throw new Error(data.error)
            set({ deathData: data, loading: false })
        } catch (error) {
            console.error('Death data fetch error:', error)
            set({ error: error instanceof Error ? error.message : 'Failed to fetch death data', loading: false })
        }
    },
    fetchMarriageData: async (startYear, endYear) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`/api/reports/marriage?startYear=${startYear}&endYear=${endYear}`)
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            const data = await response.json()
            if (data.error) throw new Error(data.error)
            set({ marriageData: data, loading: false })
        } catch (error) {
            console.error('Marriage data fetch error:', error)
            set({ error: error instanceof Error ? error.message : 'Failed to fetch marriage data', loading: false })
        }
    },
}))