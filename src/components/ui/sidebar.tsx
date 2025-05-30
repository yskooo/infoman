import * as React from "react"
import { PanelLeft } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import Button from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_COOKIE_MAX_AGE,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_MOBILE,
  SIDEBAR_WIDTH_ICON,
  SIDEBAR_KEYBOARD_SHORTCUT,
  SidebarContext,
  type SidebarContext as SidebarContextType,
} from "@/lib/hooks/use-sidebar"

interface SidebarProps extends React.ComponentProps<"div"> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: SidebarProps) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  const toggleSidebar = React.useCallback(() => {
    return isMobile
      ? setOpenMobile((open) => !open)
      : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  return (
    <SidebarContext.Provider
      value={{
        state: open ? "expanded" : "collapsed",
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      }}
    >
      <div className={className} style={style} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) {
    throw new Error("Sidebar must be used within SidebarProvider")
  }
  const { state, openMobile, setOpenMobile, isMobile } = ctx

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-[var(--sidebar-width-mobile)]">
          <div className={cn("flex h-full flex-col gap-4", className)} {...props}>
            {children}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      data-state={state}
      className={cn(
        "group/sidebar relative flex h-full flex-col gap-4 overflow-hidden border-r px-2 py-2 data-[state=expanded]:w-[var(--sidebar-width)] data-[state=collapsed]:w-[var(--sidebar-width-icon)]",
        className
      )}
      style={{
        "--sidebar-width": SIDEBAR_WIDTH,
        "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
        "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  )
}

function SidebarToggle() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) {
    throw new Error("SidebarToggle must be used within SidebarProvider")
  }
  const { toggleSidebar } = ctx

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6"
      onClick={toggleSidebar}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}

export { SidebarProvider, Sidebar, SidebarToggle }
