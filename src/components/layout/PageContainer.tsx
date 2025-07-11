
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
          "flex-1 transition-all duration-300 ease-in-out min-h-screen",
          "pt-16 md:pt-0", // Add top padding for mobile header
          isOpen ? "md:ml-64" : "md:ml-20",
          className
        )}
      >
        {children}
      </div>
    </>
  );
}
