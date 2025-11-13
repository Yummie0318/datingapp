declare module "class-variance-authority" {
    import * as React from "react";
  
    export function cva(
      base: string,
      options?: {
        variants?: Record<string, Record<string, string>>;
        defaultVariants?: Record<string, string>;
      }
    ): (...args: any[]) => string;
  
    export type VariantProps<T> = T extends { variants: infer V } ? { [K in keyof V]?: keyof V[K] } : {};
  }
  