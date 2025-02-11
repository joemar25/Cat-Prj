import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/signin/signin-input";
import { Label } from "@/components/ui/signin/signin-label";
import { handleCredentialsSignin } from "@/hooks/auth-actions";
import { signInSchema, type SignInForm } from "@/lib/validation";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-[var(--yellowColor)] to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-[var(--yellowColor)] to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};

export const SignInFormComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Create a reference to the email input field
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInForm) => {
    setIsLoading(true);
    try {
      const result = await handleCredentialsSignin(values);
      if (result?.success) {
        toast.success("Signed in successfully");
        window.location.href = result.redirectTo || "/dashboard";
      } else {
        toast.error(result?.message || "Sign-in failed");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Focus and select the email input when the component mounts
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
      emailInputRef.current.select();
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="my-2">
        <LabelInputContainer className="mb-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email">Email Address</Label>
                <FormControl>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    {...field}
                    ref={emailInputRef} // Attach ref to email input
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="password">Password</Label>
                <FormControl>
                  <div className="relative">
                    <Input id="password" placeholder="••••••••" type={showPassword ? "text" : "password"} {...field} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </LabelInputContainer>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-br relative group/btn from-blue-600 dark:from-[var(--blueColor)] dark:to-[var(--blueColor)] to-blue-800 block dark:bg-[var(--blueColor)] w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--blueColor)_inset,0px_-1px_0px_0px_var(--blueColor)_inset]"
        >
          {isLoading ? "Signing In..." : "Sign In"} &rarr;
          <BottomGradient />
        </button>
      </form>
    </Form>
  );
};
