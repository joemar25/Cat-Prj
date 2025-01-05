// src/components/ui/custom/input.tsx
import { cn } from '@/lib/utils'
import { Input as BaseInput } from '@/components/ui/input'
import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: ReactNode
    rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, leftIcon, rightIcon, ...props }, ref) => {
        return (
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {leftIcon}
                    </div>
                )}
                <BaseInput
                    className={cn(
                        className,
                        leftIcon && "pl-8",
                        rightIcon && "pr-8"
                    )}
                    ref={ref}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {rightIcon}
                    </div>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'