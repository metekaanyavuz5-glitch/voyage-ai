"use client";

import Image from "next/image";
import { CalendarDays, CheckCircle2, MapPin, Ship, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FavoriteButton } from "@/components/cruise/FavoriteButton";
import { addNights, formatCurrency, formatDate, formatDuration } from "@/lib/format";
import { useCruiseStore } from "@/store/useCruiseStore";

export function CruiseDetailsModal() {
  const cruise = useCruiseStore((state) => state.selectedCruise);
  const setSelectedCruise = useCruiseStore((state) => state.setSelectedCruise);

  const open = Boolean(cruise);
  const arrivalDate = cruise ? addNights(cruise.departureDate, cruise.duration) : null;
  const destinationsVisited = cruise
    ? Array.from(
        new Set(
          cruise.itinerary
            .filter((stop) => !stop.isSeaDay && stop.port !== cruise.departurePort)
            .map((stop) => stop.port),
        ),
      )
    : [];

  return (
    <Dialog open={open} onOpenChange={(next) => !next && setSelectedCruise(null)}>
      <DialogContent showCloseButton className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-2xl">
        {cruise && (
          <ScrollArea className="max-h-[90vh]">
            <div className="relative h-64 w-full sm:h-80">
              <Image src={cruise.image} alt={cruise.shipName} fill sizes="640px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <FavoriteButton cruiseId={cruise.id} className="absolute right-4 top-4" />
              <Badge className="absolute left-4 top-4 border-none bg-blue-600/90 text-white">
                {cruise.cruiseLine}
              </Badge>
              <div className="absolute inset-x-4 bottom-4 text-white">
                <DialogHeader className="items-start text-left">
                  <DialogTitle className="text-xl font-bold text-white sm:text-2xl">
                    {cruise.cruiseName}
                  </DialogTitle>
                </DialogHeader>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-blue-100">
                  <Ship className="h-4 w-4" />
                  {cruise.shipName}
                  <span className="mx-1 text-blue-200/50">·</span>
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {cruise.rating.toFixed(1)} ({cruise.reviewCount.toLocaleString()} reviews)
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 p-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <InfoBlock label="Departure" value={cruise.departurePort} sub={formatDate(cruise.departureDate)} />
                <InfoBlock label="Arrival" value={cruise.departurePort} sub={arrivalDate ? formatDate(arrivalDate) : ""} />
                <InfoBlock label="Duration" value={formatDuration(cruise.duration)} />
                <InfoBlock label="Destination" value={cruise.destination} />
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Itinerary</h3>
                <ol className="flex flex-col gap-3">
                  {cruise.itinerary.map((stop) => (
                    <li key={stop.day} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-xs font-semibold text-blue-700 dark:text-blue-400">
                        {stop.day}
                      </span>
                      <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3 border-b border-border/60 pb-2">
                        <span className={stop.isSeaDay ? "italic text-muted-foreground" : "font-medium text-foreground"}>
                          {stop.port}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {stop.isSeaDay
                            ? "At Sea"
                            : [stop.arrival && `Arrive ${stop.arrival}`, stop.departure && `Depart ${stop.departure}`]
                                .filter(Boolean)
                                .join(" · ")}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {destinationsVisited.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">Destinations</h3>
                  <div className="flex flex-wrap gap-2">
                    {destinationsVisited.map((stop) => (
                      <Badge key={stop} variant="secondary" className="rounded-full font-normal">
                        <MapPin className="h-3 w-3" />
                        {stop}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">Included Amenities</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {cruise.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Starting from</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(cruise.price)}
                    <span className="text-sm font-normal text-muted-foreground"> /guest</span>
                  </p>
                </div>
                {/* TODO(api): swap `cruise.bookingUrl` for the real booking deep-link once connected. */}
                <Button
                  size="lg"
                  render={<a href={cruise.bookingUrl} target="_blank" rel="noopener noreferrer" />}
                  className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-white shadow-md hover:from-blue-500 hover:to-indigo-500"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InfoBlock({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-muted/60 p-3">
      <p className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
        {label === "Departure" || label === "Arrival" ? <CalendarDays className="h-3 w-3" /> : null}
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
