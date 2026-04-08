// hooks/use-auth.ts
"use client";

import { useAuthContext } from "@/context/auth-context";

export const useAuth = () => useAuthContext();
