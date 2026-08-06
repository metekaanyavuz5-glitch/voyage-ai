"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CalendarIcon, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { usePorts } from "@/hooks/useCruises";
import { useCruiseStore } from "@/store/useCruiseStore";
import { DESTINATIONS, DURATION_BUCKETS, type Destination, type DurationBucketId } from "@/types/cruise";

export function CruiseSearch() {
  const { data: ports } = usePorts();
  const setFilters = useCruiseStore((state) => state.setFilters);
  const setSearchParams = useCruiseStore((state) => state.setSearchParams);

  const [departurePort, setDeparturePort] = useState<string | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [duration, setDuration] = useState<DurationBucketId>("any");
  const [guests, setGuests] = useState("2");

  function handleSearch() {
    setFilters({
      departurePort,
      destination,
      duration,
    });
    setSearchParams({
      departurePort,
      destination,
      departureDate: date ? date.toISOString().slice(0, 10) : null,
      duration,
      guests: Number(guests),
    });

    document.getElementById("cruise-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="hero-gradient relative overflow-hidden px-4 py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Find Your Perfect <span className="brand-gradient-text">Cruise</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-balance text-sm text-blue-100/90 sm:text-base">
            Compare sailings from the world&apos;s top cruise lines and departure ports.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-panel w-full rounded-3xl p-4 shadow-2xl sm:p-5"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="flex flex-col gap-1.5 text-left">
              <span className="px-1 text-xs font-medium text-muted-foreground">Departure Port</span>
              <Select value={departurePort} onValueChange={(value) => setDeparturePort(value)}>
                <SelectTrigger className="w-full rounded-xl bg-white/90 dark:bg-slate-900/60">
                  <SelectValue placeholder="Any port" />
                </SelectTrigger>
                <SelectContent>
                  {ports?.map((port) => (
                    <SelectItem key={port.id} value={port.name}>
                      {port.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <span className="px-1 text-xs font-medium text-muted-foreground">Destination</span>
              <Select
                value={destination}
                onValueChange={(value) => setDestination(value as Destination | null)}
              >
                <SelectTrigger className="w-full rounded-xl bg-white/90 dark:bg-slate-900/60">
                  <SelectValue placeholder="Anywhere" />
                </SelectTrigger>
                <SelectContent>
                  {DESTINATIONS.map((dest) => (
                    <SelectItem key={dest} value={dest}>
                      {dest}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <span className="px-1 text-xs font-medium text-muted-foreground">Departure Date</span>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      className="w-full justify-start rounded-xl bg-white/90 text-left font-normal dark:bg-slate-900/60"
                    />
                  }
                >
                  <CalendarIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                  {date ? format(date, "PPP") : <span className="text-muted-foreground">Any date</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} disabled={{ before: new Date() }} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <span className="px-1 text-xs font-medium text-muted-foreground">Duration</span>
              <Select
                value={duration}
                onValueChange={(value) => value && setDuration(value as DurationBucketId)}
              >
                <SelectTrigger className="w-full rounded-xl bg-white/90 dark:bg-slate-900/60">
                  <SelectValue>
                    {(value: string | null) =>
                      DURATION_BUCKETS.find((bucket) => bucket.id === value)?.label ?? "Any Duration"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {DURATION_BUCKETS.map((bucket) => (
                    <SelectItem key={bucket.id} value={bucket.id}>
                      {bucket.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <span className="px-1 text-xs font-medium text-muted-foreground">Guests</span>
              <Select value={guests} onValueChange={(value) => value && setGuests(value)}>
                <SelectTrigger className="w-full rounded-xl bg-white/90 dark:bg-slate-900/60">
                  <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                  <SelectValue>
                    {(value: string | null) => (value ? `${value} Guest${value === "1" ? "" : "s"}` : "Guests")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} Guest{n > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleSearch}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-500 hover:to-indigo-500 sm:w-auto sm:px-10"
          >
            <Search className="h-4 w-4" />
            Search Cruises
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
