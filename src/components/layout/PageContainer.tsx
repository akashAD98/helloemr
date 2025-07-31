
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarProvider";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  const { isOpen } = useSidebar();

  return (
    <>
      <MobileHeader />
      <Sidebar />
      <div 
        className={cn(
          "w-full min-w-0 overflow-x-hidden",
          className
        )}
      >
        <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {children}
        </div>
      </div>
    </>
  );
}
