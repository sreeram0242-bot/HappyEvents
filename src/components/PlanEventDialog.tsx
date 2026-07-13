import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MessageCircle } from "lucide-react";

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

export function PlanEventDialog({ children }: { children: React.ReactNode }) {
  const [eventType, setEventType] = useState<string>("");
  const [members, setMembers] = useState<string>("");
  const [date, setDate] = useState<Date>();

  const handleMessageNow = () => {
    const phoneNumber = "919626610819";
    const eventText = eventType || "an event";
    const membersText = members ? ` for around ${members} people` : "";
    const dateText = date ? ` on ${format(date, "PPP")}` : "";
    
    const text = `Hi Happy Events! I would like to plan ${eventText}${membersText}${dateText}. Please let me know the next steps.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Plan Your Event</DialogTitle>
          <DialogDescription>
            Fill out the details below and we'll connect on WhatsApp to bring your vision to life.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="eventType">Which Event?</Label>
            <Select onValueChange={setEventType} value={eventType}>
              <SelectTrigger id="eventType">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Wedding">Wedding</SelectItem>
                <SelectItem value="Birthday">Birthday</SelectItem>
                <SelectItem value="Corporate">Corporate Event</SelectItem>
                <SelectItem value="College Fest">College Fest</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="members">Estimated Members</Label>
            <Input
              id="members"
              type="number"
              placeholder="e.g. 150"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Event Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
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
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleMessageNow} 
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Message Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
