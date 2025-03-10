
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
    <div className={cn("flex items-center justify-between border-b border-border pb-5", className)}>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 animate-slideDown">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground animate-slideDown animation-delay-100">{description}</p>
        )}
      </div>
      {actions && <div className="animate-fadeIn animation-delay-200">{actions}</div>}
    </div>
  );
}
