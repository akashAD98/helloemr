import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebar } from './SidebarProvider';
import { 
  Home, 
  Users, 
  Calendar, 
  Settings as SettingsIcon, 
  ChevronLeft,
  Activity,
  Brain,
  Pill,
  Mic,
  Menu,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export function Sidebar() {
  const { isOpen, toggle, close } = useSidebar();
  const location = useLocation();
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        close();
      }
    };
    
    // Close sidebar on mobile when clicking outside or navigating
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [close, location.pathname]);
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={close}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "h-screen fixed top-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out border-r border-border bg-white/95 backdrop-blur-sm safe-area-left safe-area-top safe-area-bottom",
          // Mobile: slide in/out, Desktop: resize
          "md:translate-x-0",
          isOpen 
            ? "translate-x-0 w-64" 
            : "-translate-x-full md:translate-x-0 md:w-20"
        )}
      >
      <div className="flex items-center h-16 px-4 border-b border-border justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <Activity className="h-6 w-6 text-medical-600 flex-shrink-0" />
          {isOpen && (
            <span className="text-xl font-semibold text-medical-700 animate-fadeIn truncate">
              Deepai EMR
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className="rounded-full p-1.5 hover:bg-gray-100 transition-colors touch-target"
        >
          {isOpen ? (
            <X className="h-4 w-4 md:hidden" />
          ) : (
            <Menu className="h-4 w-4 md:hidden" />
          )}
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform duration-300 hidden md:block",
            !isOpen && "rotate-180"
          )} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-2" role="navigation" aria-label="Main navigation">
          <NavItem
            to="/"
            icon={<Home className="h-5 w-5" />}
            label="Dashboard"
            isActive={location.pathname === '/'}
            isCollapsed={!isOpen}
          />
          <NavItem
            to="/patients"
            icon={<Users className="h-5 w-5" />}
            label="Patients"
            isActive={location.pathname.startsWith('/patients')}
            isCollapsed={!isOpen}
          />
          <NavItem
            to="/appointments"
            icon={<Calendar className="h-5 w-5" />}
            label="Appointments"
            isActive={location.pathname.startsWith('/appointments')}
            isCollapsed={!isOpen}
          />
          <NavItem
            to="/deepai-audio-notes"
            icon={<Mic className="h-5 w-5" />}
            label="DeepAI Audio Notes"
            isActive={location.pathname.startsWith('/deepai-audio-notes')}
            isCollapsed={!isOpen}
          />
          <NavItem
            to="/ai-analytics"
            icon={<Brain className="h-5 w-5" />}
            label="AI Analytics"
            isActive={location.pathname.startsWith('/ai-analytics')}
            isCollapsed={!isOpen}
          />
          <NavItem
            to="/e-prescribing"
            icon={<Pill className="h-5 w-5" />}
            label="E-Prescribing"
            isActive={location.pathname.startsWith('/e-prescribing')}
            isCollapsed={!isOpen}
          />
          <NavItem
            to="/settings"
            icon={<SettingsIcon className="h-5 w-5" />}
            label="Settings"
            isActive={location.pathname.startsWith('/settings')}
            isCollapsed={!isOpen}
          />
        </nav>
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          {isOpen && (
            <div className="overflow-hidden animate-fadeIn">
              <p className="text-sm font-medium truncate">Dr. Akash Desai</p>
              <p className="text-xs text-muted-foreground truncate">Family Medicine</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
}

function NavItem({ to, icon, label, isActive, isCollapsed }: NavItemProps) {
  const { close } = useSidebar();
  
  const handleClick = () => {
    // Close sidebar on mobile when navigating
    if (window.innerWidth < 768) {
      close();
    }
  };
  
  return (
    <Link
      to={to}
      onClick={handleClick}
      className={cn(
        "flex items-center p-3 rounded-lg transition-all duration-300 group touch-target",
        isActive 
          ? "bg-medical-50 text-medical-700 border-r-2 border-medical-600" 
          : "text-gray-700 hover:bg-gray-100 hover:text-medical-600",
        isCollapsed ? "justify-center" : "gap-3"
      )}
      aria-label={label}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!isCollapsed && (
        <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">
          {label}
        </span>
      )}
    </Link>
  );
}
