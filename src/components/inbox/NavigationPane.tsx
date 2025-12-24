import { cn } from '@/lib/utils';
import { Inbox, Send, FileText, Archive, Mail } from 'lucide-react';

interface NavigationPaneProps {
  activeFolder: string;
  onFolderChange: (folder: string) => void;
  unreadCount: number;
}

const folders = [
  { id: 'inbox', name: 'Inbox', icon: Inbox },
  { id: 'sent', name: 'Sent', icon: Send },
  { id: 'drafts', name: 'Drafts', icon: FileText },
  { id: 'archive', name: 'Archive', icon: Archive },
];

export function NavigationPane({ activeFolder, onFolderChange, unreadCount }: NavigationPaneProps) {
  return (
    <div className="w-56 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <Mail className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-foreground">Elsevier Mail</span>
        </div>
      </div>

      {/* New Mail Button */}
      <div className="p-3">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-smooth font-medium text-sm">
          <Mail className="w-4 h-4" />
          New Mail
        </button>
      </div>

      {/* Folders */}
      <nav className="flex-1 px-2">
        {folders.map((folder) => {
          const Icon = folder.icon;
          const isActive = activeFolder === folder.id;
          const showBadge = folder.id === 'inbox' && unreadCount > 0;
          
          return (
            <button
              key={folder.id}
              onClick={() => onFolderChange(folder.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-smooth mb-0.5",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1 text-left">{folder.name}</span>
              {showBadge && (
                <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
            SR
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Sales Rep</p>
            <p className="text-xs text-muted-foreground truncate">sales.rep@elsevier.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
