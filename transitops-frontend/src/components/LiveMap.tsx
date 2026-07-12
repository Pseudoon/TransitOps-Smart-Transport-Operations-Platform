"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom truck icon using HTML to inherit our theme colors
const createCustomIcon = (colorClass: string, label: string) =>
  L.divIcon({
    className: "bg-transparent border-none",
    html: `
      <div class="relative flex flex-col items-center group">
        <div class="grid size-8 place-items-center rounded-full bg-card/90 shadow-glow ring-2 ${colorClass} text-foreground transition-transform group-hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
        </div>
        <div class="absolute -bottom-6 whitespace-nowrap rounded bg-popover px-1.5 py-0.5 text-[10px] font-bold text-foreground shadow-sm opacity-0 transition-opacity group-hover:opacity-100">${label}</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

export default function LiveMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="size-full animate-pulse bg-muted/40" />;
  }

  // Example route
  const route: [number, number][] = [
    [19.076, 72.8777],
    [18.9, 73.1],
    [18.5204, 73.8567],
  ];

  return (
    <MapContainer
      center={[18.8, 73.3]}
      zoom={9}
      className="z-0 size-full"
      zoomControl={false}
    >
      {/* Dark theme styled map tiles from CartoDB */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      <Polyline positions={route} pathOptions={{ color: "var(--primary)", weight: 3, dashArray: "10, 10" }} />

      <Marker position={[19.076, 72.8777]} icon={createCustomIcon("ring-primary text-primary", "T-1042")}>
        <Popup className="font-sans">
          <div className="font-semibold text-foreground">T-1042</div>
          <div className="text-xs text-muted-foreground">Dispatched · Mumbai</div>
        </Popup>
      </Marker>

      <Marker position={[18.5204, 73.8567]} icon={createCustomIcon("ring-accent text-accent", "T-1041")}>
        <Popup className="font-sans">
          <div className="font-semibold text-foreground">T-1041</div>
          <div className="text-xs text-muted-foreground">En route · Pune Hub</div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
