
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
          "flex-1 transition-all duration-300 ease-in-out min-h-screen w-full min-w-0",
          "pt-16 md:pt-0 safe-area-bottom", // Add top padding for mobile header
          isOpen ? "md:ml-64" : "md:ml-20",
          className
        )}
      >
        <div className="container mx-auto max-w-full overflow-x-hidden">
          {children}
        </div>
      </div>
    </>
  );
}
