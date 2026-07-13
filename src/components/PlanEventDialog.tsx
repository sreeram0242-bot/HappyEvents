import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MessageCircle, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PlanEventDialog({ 
  children, 
  defaultEventType = "",
  open,
  onOpenChange
}: { 
  children?: React.ReactNode, 
  defaultEventType?: string,
  open?: boolean,
  onOpenChange?: (open: boolean) => void
}) {
  const [eventType, setEventType] = useState<string>(defaultEventType);
  const [customEvent, setCustomEvent] = useState<string>("");
  const [members, setMembers] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleMessageNow = () => {
    const phoneNumber = "919626610819";
    
    const finalEventType = eventType === "Other" ? (customEvent || "Other") : eventType;
    
    const text = `Hi Happy Events! I would like to plan an event. Here are the details:

*Event Type:* ${finalEventType || "Not specified"}
*Estimated Guests:* ${members || "Not specified"}
*Event Date:* ${date ? format(date, "PPP") : "Not specified"}

Please let me know the next steps!`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px] bg-brand-cream border-2 border-brand-gold/30 shadow-2xl rounded-2xl p-0 overflow-hidden">
        <div className="bg-brand-green-deep px-6 py-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#C9A227 1px, transparent 1px)", backgroundSize: "16px 16px" }}></div>
          <DialogHeader className="relative z-10 flex flex-col items-center">
            <div className="bg-brand-gold/20 p-3 rounded-full mb-3 shadow-inner">
              <Sparkles className="w-6 h-6 text-brand-gold" />
            </div>
            <DialogTitle className="font-display text-2xl md:text-3xl text-brand-gold tracking-wide">
              Plan Your Event
            </DialogTitle>
            <DialogDescription className="text-brand-cream/80 text-sm mt-2 max-w-xs mx-auto">
              Fill out the details below and we'll connect on WhatsApp to bring your vision to life.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="grid gap-5 px-6 py-6 bg-white">
          <div className="grid gap-2.5">
            <Label htmlFor="eventType" className="text-brand-green-deep font-bold text-sm uppercase tracking-wide">Which Event?</Label>
            <Select onValueChange={setEventType} value={eventType}>
              <SelectTrigger id="eventType" className="border-2 border-brand-green-deep/30 focus:border-brand-green-deep focus:ring-brand-green-deep bg-white h-12 rounded-xl text-brand-green-deep font-medium">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent className="border-2 border-brand-green-deep bg-white">
                <SelectItem value="Wedding">Wedding</SelectItem>
                <SelectItem value="Birthday">Birthday</SelectItem>
                <SelectItem value="Corporate">Corporate Event</SelectItem>
                <SelectItem value="College Fest">College Fest</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {eventType === "Other" && (
              <Input
                placeholder="Type your custom event..."
                className="mt-1 border-2 border-brand-green-deep/30 focus-visible:border-brand-green-deep focus-visible:ring-brand-green-deep bg-white h-12 rounded-xl placeholder:text-brand-green-deep/40 text-brand-green-deep font-medium"
                value={customEvent}
                onChange={(e) => setCustomEvent(e.target.value)}
              />
            )}
          </div>
          <div className="grid gap-2.5">
            <Label htmlFor="members" className="text-brand-green-deep font-bold text-sm uppercase tracking-wide">Estimated Members</Label>
            <Input
              id="members"
              type="number"
              placeholder="e.g. 150"
              className="border-2 border-brand-green-deep/30 focus-visible:border-brand-green-deep focus-visible:ring-brand-green-deep bg-white h-12 rounded-xl placeholder:text-brand-green-deep/40 text-brand-green-deep font-medium"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
            />
          </div>
          <div className="grid gap-2.5">
            <Label className="text-brand-green-deep font-bold text-sm uppercase tracking-wide">Event Date</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-medium border-2 border-brand-green-deep/30 hover:border-brand-green-deep hover:bg-brand-green-deep/5 hover:text-brand-green-deep bg-white h-12 rounded-xl text-brand-green-deep",
                    !date && "text-brand-green-deep/50"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter className="px-6 pb-6 bg-white sm:justify-center">
          <Button 
            onClick={handleMessageNow} 
            className="w-full bg-brand-green-deep hover:bg-brand-gold text-brand-gold hover:text-brand-green-deep h-12 rounded-xl text-base font-display tracking-widest uppercase shadow-[0_4px_20px_rgba(20,40,30,0.3)] hover:shadow-[0_6px_25px_rgba(201,162,39,0.5)] transition-all duration-300 hover:-translate-y-0.5 border-2 border-brand-green-deep hover:border-brand-gold"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Proceed to WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
