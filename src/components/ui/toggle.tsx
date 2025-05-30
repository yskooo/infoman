import * as React from "react"
import { type ElementRef, type ComponentPropsWithoutRef } from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/lib/variants/toggle-variants"

interface ToggleProps
  extends ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {}

const Toggle = React.forwardRef<ElementRef<typeof TogglePrimitive.Root>, ToggleProps>(
  ({ className, variant, size, ...props }, ref) => (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
)

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle }
