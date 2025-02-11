"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

export default function TimeDisplay() {
    const [currentTime, setCurrentTime] = useState<Date | null>(null)
    const { i18n } = useTranslation()

    useEffect(() => {
        setCurrentTime(new Date())
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    if (!currentTime) return null

    return (
        <div className="flex items-center gap-2 text-sm">
            <span className="tabular-nums">
                {new Intl.DateTimeFormat(i18n.language, {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }).format(currentTime)}
            </span>
            <span className="tabular-nums border-l pl-2">
                {new Intl.DateTimeFormat(i18n.language, {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }).format(currentTime)}
            </span>
        </div>
    )
}