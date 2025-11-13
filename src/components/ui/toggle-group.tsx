"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

import { cn } from "./utils";
import { toggleVariants } from "./toggle";

// Keep these in sync with ./toggle.ts
type ToggleVariant = "default" | "outline";
type ToggleSize = "default" | "sm" | "lg";

// Context to share variant/size from the group to items
type ToggleGroupCtx = {
  variant?: ToggleVariant;
  size?: ToggleSize;
};

const ToggleGroupContext = React.createContext<ToggleGroupCtx>({
  variant: "default",
  size: "default",
});

/* ---------------------------------
   ToggleGroup (Root)
   NOTE: use a type alias (not interface extends) because Root props are a UNION.
---------------------------------- */

// Radix Root prop union
type RadixToggleGroupRootProps =
  | ToggleGroupPrimitive.ToggleGroupSingleProps
  | ToggleGroupPrimitive.ToggleGroupMultipleProps;

// Merge Radix props with our custom variants
export type ToggleGroupProps = RadixToggleGroupRootProps & {
  variant?: ToggleVariant;
  size?: ToggleSize;
  className?: string;
};

export const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(function ToggleGroup(
  {
    className,
    variant = "default",
    size = "default",
    children,
    // IMPORTANT: Radix requires `type` prop; leave it in the rest so it gets forwarded
    ...props
  },
  ref
) {
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
});

/* ---------------------------------
   ToggleGroupItem (Item)
---------------------------------- */

export type ToggleGroupItemProps =
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & {
    variant?: ToggleVariant;
    size?: ToggleSize;
    className?: string;
  };

export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(function ToggleGroupItem(
  { className, children, variant, size, ...props },
  ref
) {
  const ctx = React.useContext(ToggleGroupContext);

  const _variant: ToggleVariant = ctx.variant ?? variant ?? "default";
  const _size: ToggleSize = ctx.size ?? size ?? "default";

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      data-slot="toggle-group-item"
      data-variant={_variant}
      data-size={_size}
      className={cn(
        toggleVariants({ variant: _variant, size: _size }),
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});
