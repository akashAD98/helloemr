import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from './SidebarProvider';

export function MobileHeader() {
  const { toggle, isOpen } = useSidebar();

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-border h-16 flex items-center px-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggle}
        className="mr-2"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-medical-100 rounded-lg flex items-center justify-center">
          <span className="text-medical-700 font-bold text-sm">D</span>
        </div>
        <span className="font-semibold text-medical-700">Deepai EMR</span>
      </div>
    </div>
  );
}