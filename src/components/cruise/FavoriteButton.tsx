"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCruiseStore } from "@/store/useCruiseStore";

interface FavoriteButtonProps {
  cruiseId: string;
  className?: string;
}

export function FavoriteButton({ cruiseId, className }: FavoriteButtonProps) {
  const isFavorite = useCruiseStore((state) => state.favorites.includes(cruiseId));
  const toggleFavorite = useCruiseStore((state) => state.toggleFavorite);

  return (
    <button
      type="button"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isFavorite}
      onClick={(event) => {
        event.stopPropagation();
        toggleFavorite(cruiseId);
      }}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/85 backdrop-blur-md shadow-md transition-colors hover:bg-white dark:bg-slate-900/70 dark:hover:bg-slate-900",
        className,
      )}
    >
      <motion.span
        key={isFavorite ? "filled" : "empty"}
        initial={{ scale: 0.6, opacity: 0.4 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="flex items-center justify-center"
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-500 dark:text-slate-300",
          )}
        />
      </motion.span>
    </button>
  );
}
