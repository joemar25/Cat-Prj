// src/app/api/auth/[...nextauth]/route.ts
import { authHandler } from "@/lib/auth"

export const { GET, POST } = authHandler