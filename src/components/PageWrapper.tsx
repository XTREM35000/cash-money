import { cn } from "@/lib/utils"

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "6xl"
  noPadding?: boolean
}

export default function PageWrapper({
  children,
  className,
  maxWidth = "6xl",
  noPadding = false
}: PageWrapperProps) {
  return (
    <div className={cn(
      "w-full min-w-[320px]",
      !noPadding && "px-4 sm:px-6 md:px-8 py-4 sm:py-6",
      `max-w-${maxWidth}`,
      "mx-auto",
      className
    )}>
      <div className="w-full bg-gradient-to-r from-blue-50 to-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
        <div className={cn(
          "w-full",
          !noPadding && "p-4 sm:p-6 lg:p-8"
        )}>
          {children}
        </div>
      </div>
    </div>
  )
}