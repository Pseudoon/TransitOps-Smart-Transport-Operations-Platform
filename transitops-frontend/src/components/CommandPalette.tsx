"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
  Truck,
  Users,
  AlertCircle,
  FileText,
  Search,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Expose function globally so Navbar can trigger it without context
  useEffect(() => {
    (window as any).openCommandPalette = () => setOpen(true);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <Command
        className="relative z-50 w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95"
        label="Global Command Menu"
      >
        <div className="flex items-center border-b border-border px-3" cmdk-input-wrapper="">
          <Search className="mr-2 size-4 shrink-0 text-muted-foreground" />
          <Command.Input
            autoFocus
            placeholder="Type a command or search..."
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            <Command.Item
              onSelect={() => runCommand(() => router.push("/"))}
              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-muted aria-selected:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <Zap className="mr-2 size-4" />
              <span>Dashboard</span>
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => router.push("/vehicles"))}
              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-muted aria-selected:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <Truck className="mr-2 size-4" />
              <span>Vehicles</span>
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => router.push("/drivers"))}
              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-muted aria-selected:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <Users className="mr-2 size-4" />
              <span>Drivers</span>
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => router.push("/reports"))}
              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-muted aria-selected:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <FileText className="mr-2 size-4" />
              <span>Reports</span>
            </Command.Item>
          </Command.Group>

          <Command.Separator className="-mx-1 my-1 h-px bg-border" />

          <Command.Group heading="Quick Actions" className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            <Command.Item
              onSelect={() => runCommand(() => toast.success("Vehicle T-1042 has been dispatched."))}
              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-muted aria-selected:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <Truck className="mr-2 size-4" />
              <span>Dispatch Vehicle...</span>
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => toast.error("Reported incident for Route 4A."))}
              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-muted aria-selected:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <AlertCircle className="mr-2 size-4" />
              <span>Report Incident</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
