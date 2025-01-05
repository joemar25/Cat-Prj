// src/app/dashboard/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Page() {
  const session = await auth()
  if (!session) redirect("/sign-in")

  return (
    <>
      Hello
    </>
  )
}