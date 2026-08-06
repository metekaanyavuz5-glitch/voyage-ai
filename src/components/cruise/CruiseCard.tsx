"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Ship, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/cruise/FavoriteButton";
import { formatCurrency, formatDate, formatDuration } from "@/lib/format";
import { useCruiseStore } from "@/store/useCruiseStore";
import type { Cruise } from "@/types/cruise";

interface CruiseCardProps {
  cruise: Cruise;
}

export function CruiseCard({ cruise }: CruiseCardProps) {
  const setSelectedCruise = useCruiseStore((state) => state.setSelectedCruise);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={() => setSelectedCruise(cruise)}
      className="group glass-card flex cursor-pointer flex-col overflow-hidden rounded-3xl transition-shadow hover:shadow-xl hover:shadow-blue-950/10"
    >
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={cruise.image}
          alt={`${cruise.shipName} — ${cruise.cruiseLine}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
        <Badge className="absolute left-3 top-3 border-none bg-blue-600/90 text-white shadow-md backdrop-blur-sm">
          {cruise.cruiseLine}
        </Badge>
        <FavoriteButton cruiseId={cruise.id} className="absolute right-3 top-3" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-900 shadow-md backdrop-blur-sm dark:bg-slate-900/85 dark:text-slate-100">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {cruise.rating.toFixed(1)}
          <span className="font-normal text-slate-500 dark:text-slate-400">({cruise.reviewCount.toLocaleString()})</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-balance text-base font-semibold leading-snug text-foreground">
            {cruise.cruiseName}
          </h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Ship className="h-3.5 w-3.5" />
            {cruise.shipName}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
            <span className="truncate">
              {cruise.departurePort} <span className="text-muted-foreground/60">→</span> {cruise.destination}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
            <span>
              {formatDate(cruise.departureDate)} · {formatDuration(cruise.duration)}
            </span>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="text-xs text-muted-foreground">Estimated from</p>
            <p className="text-xl font-bold text-foreground">
              {formatCurrency(cruise.price)}
              <span className="text-xs font-normal text-muted-foreground"> /guest</span>
            </p>
          </div>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              setSelectedCruise(cruise);
            }}
            className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-500 hover:to-indigo-500"
          >
            Book Now
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
