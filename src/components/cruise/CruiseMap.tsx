"use client";

import { useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  AttributionControl,
  Map as MaplibreMap,
  Marker,
  NavigationControl,
  Popup,
  type StyleSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { CruisePin } from "@/components/cruise/CruisePin";
import { CruisePinPopup } from "@/components/cruise/CruisePinPopup";
import { useCruises } from "@/hooks/useCruises";
import { useCruiseStore } from "@/store/useCruiseStore";
import type { Cruise } from "@/types/cruise";

/**
 * Free, key-less raster basemap (CARTO Voyager) — no account or token
 * required. A raster tile source is a plain grid of PNG images, so it skips
 * the vector-tile parsing/worker pipeline entirely: far fewer moving parts
 * than a vector style, and the same familiar, labeled look as Google Maps.
 * Declared inline (rather than a style.json URL) so the map doesn't depend
 * on an extra network round-trip to resolve its own style.
 */
const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    "carto-voyager": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        "https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      ],
      tileSize: 256,
      attribution: "© CARTO © OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "carto-voyager-layer",
      type: "raster",
      source: "carto-voyager",
    },
  ],
};

/** Pixel radius cruise pins fan out to when several share the same departure port. */
const PIN_SPREAD_RADIUS = 16;

/** Small helper: unmounting a React root during a map DOM teardown can
 * warn about unmounting mid-render — deferring to a microtask avoids it. */
function deferredUnmount(root: Root) {
  setTimeout(() => root.unmount(), 0);
}

/** Groups cruises by departure port and assigns each a small pixel offset so
 * pins sharing a port fan out around it instead of stacking exactly. */
function layoutPins(cruises: Cruise[]): Array<{ cruise: Cruise; offset: [number, number] }> {
  const byPort = new Map<string, Cruise[]>();
  for (const cruise of cruises) {
    const group = byPort.get(cruise.departurePort);
    if (group) group.push(cruise);
    else byPort.set(cruise.departurePort, [cruise]);
  }

  const laid: Array<{ cruise: Cruise; offset: [number, number] }> = [];
  for (const group of byPort.values()) {
    group.forEach((cruise, i) => {
      if (group.length === 1) {
        laid.push({ cruise, offset: [0, 0] });
        return;
      }
      const angle = (2 * Math.PI * i) / group.length;
      laid.push({
        cruise,
        offset: [Math.round(Math.cos(angle) * PIN_SPREAD_RADIUS), Math.round(Math.sin(angle) * PIN_SPREAD_RADIUS)],
      });
    });
  }
  return laid;
}

export function CruiseMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const activePopupRef = useRef<Popup | null>(null);

  const filters = useCruiseStore((state) => state.filters);
  const setSelectedCruise = useCruiseStore((state) => state.setSelectedCruise);
  const { data: cruises } = useCruises(filters);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new MaplibreMap({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [10, 25],
      zoom: 1.3,
      attributionControl: false,
    });

    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new AttributionControl({ compact: true }));
    mapRef.current = map;

    // The map's container can still be mid-layout (e.g. above sections
    // finishing their entrance animation) when the map is constructed, which
    // leaves MapLibre's internal viewport size stale. A ResizeObserver keeps
    // it in sync whenever the container's actual size changes.
    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      activePopupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !cruises || cruises.length === 0) return;

    const markers: Marker[] = [];
    const roots: Root[] = [];

    function openCruisePopup(cruise: Cruise, offset: [number, number]) {
      activePopupRef.current?.remove();

      const popupNode = document.createElement("div");
      const popupRoot = createRoot(popupNode);
      // closeOnClick: false — MapLibre's marker click also reaches the map's
      // own click handling, which would otherwise close a popup the instant
      // it opens (the marker click and the "click outside" close are the
      // same event). We already close the previous popup explicitly above.
      const popup = new Popup({
        offset: [offset[0], offset[1] + 16],
        maxWidth: "260px",
        closeButton: true,
        closeOnClick: false,
      })
        .setLngLat(cruise.departureCoordinates)
        .setDOMContent(popupNode)
        .addTo(map!);

      popupRoot.render(
        <CruisePinPopup
          cruise={cruise}
          onViewDetails={() => {
            setSelectedCruise(cruise);
            popup.remove();
          }}
        />,
      );

      popup.on("close", () => deferredUnmount(popupRoot));
      activePopupRef.current = popup;
    }

    layoutPins(cruises).forEach(({ cruise, offset }) => {
      const el = document.createElement("div");
      const root = createRoot(el);
      roots.push(root);

      root.render(<CruisePin cruiseName={cruise.cruiseName} onClick={() => openCruisePopup(cruise, offset)} />);

      const marker = new Marker({ element: el, anchor: "center", offset })
        .setLngLat(cruise.departureCoordinates)
        .addTo(map);
      markers.push(marker);
    });

    return () => {
      markers.forEach((marker) => marker.remove());
      roots.forEach(deferredUnmount);
    };
  }, [cruises, setSelectedCruise]);

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-border shadow-lg sm:h-[480px]">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
