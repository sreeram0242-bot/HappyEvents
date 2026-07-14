import React, { useState } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { PlanEventDialog } from './PlanEventDialog';
import { cn } from '@/lib/utils';

export function SlideToPlanButton({ className }: { className?: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <PlanEventDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <button
        onClick={() => setIsDialogOpen(true)}
        className={cn(
          "relative flex items-center justify-center gap-2 h-9 md:h-10 px-4 md:px-5 rounded-sm bg-brand-gold select-none shadow-[0_0_15px_rgba(201,162,39,0.4)] transition-transform hover:scale-105 active:scale-95 outline-none focus:outline-none cursor-pointer",
          className
        )}
      >
        <span className="text-[11px] md:text-[12px] font-normal uppercase tracking-normal text-brand-green-deep whitespace-nowrap">
          Plan your event
        </span>
        <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-brand-green-deep shrink-0" strokeWidth={2.5} />
      </button>
    </>
  );
}
