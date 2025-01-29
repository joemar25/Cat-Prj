'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Maximize2, Minimize2 } from 'lucide-react'

export function FullscreenToggle() {
    const [isFullscreen, setIsFullscreen] = useState(false)

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            document.documentElement.requestFullscreen().catch(console.error)
        } else {
            document.exitFullscreen().catch(console.error)
        }
        setIsFullscreen(!isFullscreen)
    }

    return (
        <Button
            variant="outline"
            className="h-9 px-4"
            onClick={toggleFullscreen}
        >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
    )
}
