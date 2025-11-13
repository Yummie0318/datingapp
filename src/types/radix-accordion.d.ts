declare module "@radix-ui/react-accordion" {
    import * as React from "react";
  
    type AccordionProps = React.ComponentPropsWithoutRef<'div'> & {
      type?: 'single' | 'multiple';
      defaultValue?: string | string[];
      value?: string | string[];
      onValueChange?: (value: string | string[]) => void;
      collapsible?: boolean;
    };
  
    export const Root: React.FC<AccordionProps>;
    export const Item: React.FC<React.ComponentPropsWithoutRef<'div'>>;
    export const Trigger: React.FC<React.ComponentPropsWithoutRef<'button'>>;
    export const Header: React.FC<React.ComponentPropsWithoutRef<'div'>>;
    export const Content: React.FC<React.ComponentPropsWithoutRef<'div'>>;
  }
  