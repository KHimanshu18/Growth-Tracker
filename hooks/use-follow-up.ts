"use client";

import { useVisitorContext } from "@/context/visitor-context";

export function useVisitor() {
  return useVisitorContext();
}
