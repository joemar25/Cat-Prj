'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'zh', label: '中文' },
]

export function LanguageSelector() {
    const [selectedLanguage, setSelectedLanguage] = useState('en')

    const handleLanguageChange = (code: string) => {
        setSelectedLanguage(code)
        // Add logic to update the app language, e.g., through i18n library
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="h-9 px-4 flex items-center gap-2"
                >
                    <Globe className="h-4 w-4" />
                    <span>{languages.find((lang) => lang.code === selectedLanguage)?.label || 'Language'}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={language.code === selectedLanguage ? 'font-bold' : ''}
                    >
                        {language.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
