declare module "@radix-ui/react-alert-dialog" {
    import * as React from "react";
  
    export const Root: React.FC<React.ComponentPropsWithoutRef<'div'>>;
    export const Trigger: React.FC<React.ComponentPropsWithoutRef<'button'>>;
    export const Portal: React.FC<React.ComponentPropsWithoutRef<'div'>>;
    export const Overlay: React.FC<React.ComponentPropsWithoutRef<'div'>>;
    export const Content: React.FC<React.ComponentPropsWithoutRef<'div'>>;
    export const Title: React.FC<React.ComponentPropsWithoutRef<'h2'>>;
    export const Description: React.FC<React.ComponentPropsWithoutRef<'p'>>;
    export const Action: React.FC<React.ComponentPropsWithoutRef<'button'>>;
    export const Cancel: React.FC<React.ComponentPropsWithoutRef<'button'>>;
  }
  