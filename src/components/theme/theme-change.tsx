'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from '@/components/ui/tooltip'
import { Button } from '../../ui/button'

export function ThemeChange() {
    const { setTheme, theme } = useTheme()

    return (
        <TooltipProvider disableHoverableContent>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                    <Button
                        className='switch rounded-sm w-8 h-8 bg-transparent mr-2'
                        variant={'outline'}
                        size='icon'
                        id='switch'
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        <SunIcon className='w-[1.2rem] h-[1.2rem] rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100' />
                        <MoonIcon className='absolute w-[1.2rem] h-[1.2rem] rotate-0 scale-1000 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0' />
                        <span className='sr-only'>Switch Theme</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side='bottom' autoFocus={false}>Switch Theme</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}