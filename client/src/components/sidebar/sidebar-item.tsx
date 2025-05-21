import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarItemProps {
  icon: LucideIcon;
  href: string;
  label: string;
  active?: boolean;
}

export function SidebarItem({ icon: Icon, href, label, active }: SidebarItemProps) {
  const navigate = useNavigate();
  
  return (
    <button
      className={`flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm transition-colors ${active ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'}`}
      onClick={() => navigate(href)}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
