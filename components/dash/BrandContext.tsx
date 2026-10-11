"use client";

import { createContext, useContext } from "react";

export type Brand = { logoUrl: string | null; brandName: string | null; tagline: string | null };

const BrandCtx = createContext<Brand>({ logoUrl: null, brandName: null, tagline: null });

export const useBrand = () => useContext(BrandCtx);

export function BrandProvider({ value, children }: { value: Brand; children: React.ReactNode }) {
  return <BrandCtx.Provider value={value}>{children}</BrandCtx.Provider>;
}
