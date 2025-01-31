'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'
import i18n from '@/translation/i18n'


const languages = [
    { code: 'en', label: 'English' },
    { code: 'fil', label: 'Filipino' },
]

export function LanguageSelector() {
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language) // Initialize with the current language

    const handleLanguageChange = (code: string) => {
        setSelectedLanguage(code) // Update the selected language state
        i18n.changeLanguage(code) // Change the language in i18n
        localStorage.setItem('language', code) // Save the selected language to localStorage
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