import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from './SidebarProvider';

export function MobileHeader() {
  const { toggle, isOpen } = useSidebar();

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border h-16 flex items-center px-4 safe-area-top safe-area-left safe-area-right">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggle}
        className="mr-3 touch-target"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="h-8 w-8 bg-medical-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-medical-700 font-bold text-sm">D</span>
        </div>
        <span className="font-semibold text-medical-700 truncate">Deepai EMR</span>
      </div>
    </div>
  );
}