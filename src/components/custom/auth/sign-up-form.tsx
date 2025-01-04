'use client'

import { toast } from "sonner"
import { useState } from "react"
import { UserRole } from "@prisma/client"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { handleCredentialsSignin, handleSignUp } from "@/hooks/auth-actions"
import { signUpSchema, SignUpForm as SignUpData } from "@/lib/zod"
import { PasswordInput } from "@/components/custom/general/password-input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

interface SignUpFormProps {
    onSuccess?: () => void
}

export const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const isDevelopment = process.env.NEXT_PUBLIC_NODE_ENV === 'development'

    const form = useForm<SignUpData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: isDevelopment ? "mar" : "",
            email: isDevelopment ? "mar@test.com" : "",
            password: isDevelopment ? "mar1234!" : "",
            confirmPassword: isDevelopment ? "mar1234!" : "",
            role: UserRole.STAFF
        },
    })

    const onSubmit = async (values: SignUpData) => {
        setIsLoading(true)
        const data = await handleSignUp(values)

        if (data.success) {
            toast.success("Signed up successfully")
            // Auto sign-in after successful sign-up
            const signInValues = {
                email: values.email,
                password: values.password,
            }
            await handleCredentialsSignin(signInValues)
            onSuccess?.()
        } else {
            toast.error(data.message)
        }
        setIsLoading(false)
    }

    const fields = [
        { name: "name", label: "Name", type: "text", placeholder: "Enter your name" },
        { name: "email", label: "Email", type: "email", placeholder: "Enter your email" },
    ] as const

    const roleOptions = [
        { value: UserRole.ADMIN, label: "Admin" },
        { value: UserRole.STAFF, label: "Staff" },
    ]

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Name and Email fields */}
                {fields.map((field) => (
                    <FormField
                        key={field.name}
                        control={form.control}
                        name={field.name}
                        render={({ field: formField }) => (
                            <FormItem>
                                <FormLabel>{field.label}</FormLabel>
                                <FormControl>
                                    <Input
                                        {...formField}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}

                {/* Role Selection - Only in development mode */}
                {isDevelopment && (
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange(value as UserRole)}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {roleOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Password fields */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    {...field}
                                    placeholder="Enter your password"
                                    name="password"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    {...field}
                                    placeholder="Confirm your password"
                                    name="confirmPassword"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit Button */}
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
            </form>
        </Form>
    )
}