
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  actions,
  className 
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 sm:pb-5 gap-4 sm:gap-0", className)}>
      <div className="min-w-0 flex-1">
        <h1 className="responsive-text-lg font-semibold text-gray-900 animate-slideDown truncate">{title}</h1>
        {description && (
          <p className="mt-1 responsive-text-xs text-muted-foreground animate-slideDown animation-delay-100">{description}</p>
        )}
      </div>
      {actions && (
        <div className="animate-fadeIn animation-delay-200 flex-shrink-0 w-full sm:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
