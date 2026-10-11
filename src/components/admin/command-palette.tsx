"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, LayoutDashboard, Users, FolderTree, CalendarCheck, Settings, X, Image as ImageIcon, MessageSquareQuote, FileText } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const actions = [
    { label: "Dashboard Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Artist Approvals & List", href: "/admin/artists", icon: Users },
    { label: "Categories & Sub-Categories", href: "/admin/categories", icon: FolderTree },
    { label: "All Bookings & Leads", href: "/admin/bookings", icon: CalendarCheck },
    { label: "Promotional Banners", href: "/admin/content/banners", icon: ImageIcon },
    { label: "Client Testimonials", href: "/admin/content/testimonials", icon: MessageSquareQuote },
    { label: "Static Pages Editor", href: "/admin/content/pages", icon: FileText },
    { label: "Blog Posts & Articles", href: "/admin/blog", icon: FileText },
    { label: "Platform Settings", href: "/admin/settings", icon: Settings },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Type a command or jump to page..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm md:text-sm text-[#1e1a19] placeholder:text-gray-400 outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#1e1a19] hover:bg-[#fcf1ef] hover:text-[#eb7583] transition-colors text-left"
                >
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span>{item.label}</span>
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-sm text-gray-500">
              No matching commands or pages found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <span>Navigation</span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px]">ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
