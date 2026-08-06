"use client";

import { useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useCruises, usePorts } from "@/hooks/useCruises";
import { useCruiseStore } from "@/store/useCruiseStore";
import { formatCurrency } from "@/lib/format";
import {
  CRUISE_LINES,
  DESTINATIONS,
  DURATION_BUCKETS,
  RATING_OPTIONS,
  DEFAULT_FILTERS,
  type CruiseLine,
  type Destination,
  type DurationBucketId,
  type RatingOptionId,
} from "@/types/cruise";

const ANY = "any";

export function CruiseFilters() {
  const filters = useCruiseStore((state) => state.filters);
  const setFilters = useCruiseStore((state) => state.setFilters);
  const clearFilters = useCruiseStore((state) => state.clearFilters);

  const { data: ports } = usePorts();
  const { data: allCruises } = useCruises();

  const shipOptions = useMemo(() => {
    const source = allCruises ?? [];
    const scoped = filters.cruiseLine
      ? source.filter((cruise) => cruise.cruiseLine === filters.cruiseLine)
      : source;
    return Array.from(new Set(scoped.map((cruise) => cruise.shipName))).sort();
  }, [allCruises, filters.cruiseLine]);

  const activeCount = [
    filters.departurePort,
    filters.destination,
    filters.cruiseLine,
    filters.ship,
    filters.duration !== "any" ? filters.duration : null,
    filters.rating !== "any" ? filters.rating : null,
    filters.priceRange[0] !== DEFAULT_FILTERS.priceRange[0] ||
    filters.priceRange[1] !== DEFAULT_FILTERS.priceRange[1]
      ? "price"
      : null,
  ].filter(Boolean).length;

  return (
    <div className="glass-card flex flex-col gap-5 rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          Filters {activeCount > 0 && <span className="text-blue-600 dark:text-blue-400">({activeCount})</span>}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear Filters
        </Button>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Departure Port</Label>
        <Select
          value={filters.departurePort ?? ANY}
          onValueChange={(value) => setFilters({ departurePort: value === ANY ? null : value })}
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue>{(value: string) => (value === ANY ? "Any Port" : value)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any Port</SelectItem>
            {ports?.map((port) => (
              <SelectItem key={port.id} value={port.name}>
                {port.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Destination</Label>
        <Select
          value={filters.destination ?? ANY}
          onValueChange={(value) =>
            setFilters({ destination: value === ANY ? null : (value as Destination) })
          }
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue>{(value: string) => (value === ANY ? "Anywhere" : value)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Anywhere</SelectItem>
            {DESTINATIONS.map((dest) => (
              <SelectItem key={dest} value={dest}>
                {dest}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Cruise Line</Label>
        <Select
          value={filters.cruiseLine ?? ANY}
          onValueChange={(value) =>
            setFilters({
              cruiseLine: value === ANY ? null : (value as CruiseLine),
              // Reset ship when the line changes so stale ship/line combos can't linger.
              ship: null,
            })
          }
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue>{(value: string) => (value === ANY ? "Any Cruise Line" : value)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any Cruise Line</SelectItem>
            {CRUISE_LINES.map((line) => (
              <SelectItem key={line} value={line}>
                {line}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Ship</Label>
        <Select
          value={filters.ship ?? ANY}
          onValueChange={(value) => setFilters({ ship: value === ANY ? null : value })}
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue>{(value: string) => (value === ANY ? "Any Ship" : value)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any Ship</SelectItem>
            {shipOptions.map((ship) => (
              <SelectItem key={ship} value={ship}>
                {ship}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Price Range</Label>
          <span className="text-xs font-medium text-foreground">
            {formatCurrency(filters.priceRange[0])} – {formatCurrency(filters.priceRange[1])}
          </span>
        </div>
        <Slider
          value={filters.priceRange}
          min={0}
          max={3000}
          step={50}
          onValueChange={(value) => {
            if (Array.isArray(value)) setFilters({ priceRange: [value[0], value[1]] });
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Duration</Label>
        <Select
          value={filters.duration}
          onValueChange={(value) => value && setFilters({ duration: value as DurationBucketId })}
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue>
              {(value: string) => DURATION_BUCKETS.find((bucket) => bucket.id === value)?.label}
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

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Rating</Label>
        <Select
          value={filters.rating}
          onValueChange={(value) => value && setFilters({ rating: value as RatingOptionId })}
        >
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue>
              {(value: string) => RATING_OPTIONS.find((option) => option.id === value)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {RATING_OPTIONS.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
