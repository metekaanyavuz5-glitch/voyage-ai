"use client";

import { useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPinned } from "lucide-react";
import { CruiseMarker } from "@/components/cruise/CruiseMarker";
import { PortPopup } from "@/components/cruise/PortPopup";
import { usePorts } from "@/hooks/useCruises";
import { useCruiseStore } from "@/store/useCruiseStore";
import type { CruisePort } from "@/types/cruise";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

/** Small helper: unmounting a React root during a Mapbox DOM teardown can
 * warn about unmounting mid-render — deferring to a microtask avoids it. */
function deferredUnmount(root: Root) {
  setTimeout(() => root.unmount(), 0);
}

export function CruiseMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const activePopupRef = useRef<mapboxgl.Popup | null>(null);

  const { data: ports } = usePorts();
  const viewCruisesForPort = useCruiseStore((state) => state.viewCruisesForPort);
  const selectedPort = useCruiseStore((state) => state.selectedPort);

  useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [10, 25],
      zoom: 1.3,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));
    mapRef.current = map;

    return () => {
      activePopupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ports || ports.length === 0) return;

    const markers: mapboxgl.Marker[] = [];
    const roots: Root[] = [];

    function openPortPopup(port: CruisePort) {
      activePopupRef.current?.remove();

      const popupNode = document.createElement("div");
      const popupRoot = createRoot(popupNode);
      const popup = new mapboxgl.Popup({ offset: 32, maxWidth: "260px", closeButton: true })
        .setLngLat(port.coordinates)
        .setDOMContent(popupNode)
        .addTo(map!);

      popupRoot.render(
        <PortPopup
          port={port}
          onViewCruises={() => {
            viewCruisesForPort(port);
            popup.remove();
            document.getElementById("cruise-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />,
      );

      popup.on("close", () => deferredUnmount(popupRoot));
      activePopupRef.current = popup;
    }

    ports.forEach((port) => {
      const el = document.createElement("div");
      const root = createRoot(el);
      roots.push(root);

      root.render(
        <CruiseMarker
          cruiseCount={port.cruiseCount}
          isSelected={selectedPort?.id === port.id}
          onClick={() => openPortPopup(port)}
        />,
      );

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat(port.coordinates)
        .addTo(map);
      markers.push(marker);
    });

    return () => {
      markers.forEach((marker) => marker.remove());
      roots.forEach(deferredUnmount);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ports, selectedPort?.id]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="glass-card flex h-[420px] w-full flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border px-6 text-center">
        <MapPinned className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <div>
          <p className="font-semibold text-foreground">Interactive map unavailable</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Add a Mapbox access token to <code className="rounded bg-muted px-1 py-0.5">.env.local</code>{" "}
            as <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_MAPBOX_TOKEN</code> to see
            cruise departure ports on the map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-border shadow-lg sm:h-[480px]">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
