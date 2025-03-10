
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarProvider";
import { Sidebar } from "./Sidebar";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  const { isOpen } = useSidebar();

  return (
    <>
      <Sidebar />
      <div 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out min-h-screen",
          isOpen ? "ml-64" : "ml-20",
          className
        )}
      >
        {children}
      </div>
    </>
  );
}
