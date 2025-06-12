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
  Mic
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Sidebar() {
  const { isOpen, toggle } = useSidebar();
  const location = useLocation();
  
  return (
    <div
      className={cn(
        "h-screen fixed top-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out border-r border-border bg-white",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center h-16 px-4 border-b border-border justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          {isOpen && (
            <span className="text-xl font-semibold text-medical-700 animate-fadeIn">Deepai EMR</span>
          )}
          {!isOpen && <Activity className="h-6 w-6 text-medical-600" />}
        </div>
        <button
          onClick={toggle}
          className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform duration-300",
            !isOpen && "rotate-180"
          )} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-2">
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
        </ul>
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
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "flex items-center p-2 rounded-lg transition-all duration-300",
          isActive 
            ? "bg-medical-50 text-medical-700" 
            : "text-gray-700 hover:bg-gray-100",
          isCollapsed ? "justify-center" : "gap-3"
        )}
      >
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </Link>
    </li>
  );
}
