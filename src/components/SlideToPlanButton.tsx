import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { PlanEventDialog } from './PlanEventDialog';
import { cn } from '@/lib/utils';

export function SlideToPlanButton({ className }: { className?: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0); // 0 to 1
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbWidth, setThumbWidth] = useState(0);

  useEffect(() => {
    if (trackRef.current) setTrackWidth(trackRef.current.getBoundingClientRect().width);
    if (thumbRef.current) setThumbWidth(thumbRef.current.getBoundingClientRect().width);
    
    const ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === trackRef.current) setTrackWidth(entry.contentRect.width);
        if (entry.target === thumbRef.current) setThumbWidth(entry.contentRect.width);
      }
    });
    
    if (trackRef.current) ro.observe(trackRef.current);
    if (thumbRef.current) ro.observe(thumbRef.current);
    
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const handlePointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (slideProgress > 0.95) {
          setIsDialogOpen(true);
        }
        setSlideProgress(0);
      }
    };
    
    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging && trackRef.current) {
        const rect = trackRef.current.getBoundingClientRect();
        // Calculate x position relative to track
        // Subtract half thumb width so the thumb's center follows the pointer
        let x = e.clientX - rect.left - (thumbWidth / 2);
        
        const maxSlide = trackWidth - thumbWidth - 8; // 8 is padding (left 4px + right 4px)
        
        if (maxSlide > 0) {
          let progress = x / maxSlide;
          if (progress < 0) progress = 0;
          if (progress > 1) progress = 1;
          setSlideProgress(progress);
        }
      }
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, slideProgress, trackWidth, thumbWidth]);

  const maxSlidePx = trackWidth - thumbWidth - 8;
  const currentTranslateX = isDragging || slideProgress > 0 ? slideProgress * maxSlidePx : 0;

  return (
    <>
      <PlanEventDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      
      <div 
        ref={trackRef}
        className={cn(
          "relative flex items-center h-12 md:h-14 w-full max-w-[320px] rounded-full bg-brand-gold overflow-hidden select-none touch-none shadow-[0_0_15px_rgba(201,162,39,0.4)]",
          className
        )}
      >
        {/* Background Text and Icon */}
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center gap-2 pointer-events-none z-10 w-full pr-4 pl-12",
            !isDragging && "transition-opacity duration-300 ease-out"
          )}
          style={{ opacity: 1 - (slideProgress * 1.5) }}
        >
          <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-brand-green-deep whitespace-nowrap">
            Slide to plan your event
          </span>
          <Calendar className="h-4 w-4 text-brand-green-deep shrink-0" strokeWidth={2.5} />
        </div>

        {/* Draggable Thumb */}
        <div 
          ref={thumbRef}
          className={cn(
            "absolute left-1 top-1 bottom-1 aspect-square rounded-full bg-brand-green-deep flex items-center justify-center z-20 cursor-grab active:cursor-grabbing shadow-md border-2 border-brand-green-deep/20",
            !isDragging && "transition-transform duration-300 ease-out"
          )}
          style={{ 
            transform: `translateX(${currentTranslateX}px)`
          }}
          onPointerDown={(e) => {
            // Only left mouse button or touch
            if (e.button !== 0 && e.pointerType === 'mouse') return;
            e.preventDefault();
            e.currentTarget.setPointerCapture(e.pointerId);
            setIsDragging(true);
          }}
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-brand-gold" />
        </div>
      </div>
    </>
  );
}
