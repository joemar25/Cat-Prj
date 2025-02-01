'use client'

import { toast } from "sonner"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { PasswordInput } from "@/components/custom/general/password-input"
import { handleCredentialsSignin, handleSignUp } from "@/hooks/auth-actions"
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
import { useRoles } from "@/hooks/use-roles"
import { createSignUpSchema, SignUpForm } from "@/lib/validation"

interface SignUpFormProps {
    onSuccess?: () => void
}

type Field = {
    name: keyof SignUpForm
    label: string
    type: string
    placeholder: string
}

export const SignUpFormComponent = ({ onSuccess }: SignUpFormProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const isDevelopment = process.env.NEXT_PUBLIC_NODE_ENV === 'development'
    const { roles, loading: rolesLoading, error: rolesError } = useRoles()

    // Compute allowedRoles even if still loading (it might be empty initially)
    const allowedRoles = roles?.map((role) => role.name) || []

    // Define schema using allowedRoles (if allowedRoles is empty, handle it in your schema or defaults)
    const signUpSchema = createSignUpSchema(allowedRoles)

    // Always call useForm
    const form = useForm<SignUpForm>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: isDevelopment ? "mar" : "",
            email: isDevelopment ? "mar@test.com" : "",
            password: isDevelopment ? "mar1234!" : "",
            confirmPassword: isDevelopment ? "mar1234!" : "",
            role: allowedRoles.length > 0 ? allowedRoles[0] : "",
        },
    })

    useEffect(() => {
        if (isDevelopment && allowedRoles.length > 0 && !form.getValues("role")) {
            form.setValue("role", allowedRoles[0])
        }
    }, [allowedRoles, isDevelopment, form])

    const onSubmit = async (values: SignUpForm) => {
        setIsLoading(true)
        const data = await handleSignUp(values)
        if (data.success) {
            toast.success("Signed up successfully")
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

    const fields: Field[] = [
        { name: "name", label: "Name", type: "text", placeholder: "Enter your name" },
        { name: "email", label: "Email", type: "email", placeholder: "Enter your email" },
    ]

    return (
        <>
            {rolesLoading ? (
                <p>Loading roles...</p>
            ) : rolesError ? (
                <p>Error loading roles: {rolesError}</p>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {fields.map((field) => (
                            <FormField
                                key={field.name}
                                control={form.control}
                                name={field.name as "name" | "email" | "password" | "confirmPassword" | "role"}
                                render={({ field: formField }) => (
                                    <FormItem>
                                        <FormLabel>{field.label}</FormLabel>
                                        <FormControl>
                                            <Input {...formField} type={field.type} placeholder={field.placeholder} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(value)}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {allowedRoles.map((role) => (
                                                <SelectItem key={role} value={role}>
                                                    {role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput {...field} placeholder="Enter your password" name="password" />
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
                                        <PasswordInput {...field} placeholder="Confirm your password" name="confirmPassword" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>
                </Form>
            )}
        </>
    )
}
