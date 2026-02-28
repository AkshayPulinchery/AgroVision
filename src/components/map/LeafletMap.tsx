
"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import * as L from "leaflet";
import { useEffect, useMemo } from "react";

// Fix Leaflet marker icon issues in Next.js
const getCustomIcon = (color: string = 'hsl(var(--primary))') => {
  if (typeof window === 'undefined') return null;
  return new L.DivIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-12 h-12 bg-white/20 rounded-full animate-ping"></div>
        <div class="w-10 h-10 bg-primary border-[6px] border-white rounded-full shadow-2xl transition-transform hover:scale-125 z-20" style="background-color: ${color}"></div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

type Field = {
  id: string;
  name: string;
  crop: string;
  moisture: number;
  health: number;
  lat: number;
  lng: number;
};

interface LeafletMapProps {
  fields: Field[];
  onSelectField: (field: Field) => void;
  selectedField: Field | null;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15, { animate: true });
  }, [center, map]);
  return null;
}

export default function LeafletMap({ fields, onSelectField, selectedField }: LeafletMapProps) {
  // Center map on fields or a default location (Los Angeles as example)
  const defaultCenter: [number, number] = [34.0522, -118.2437];
  
  const center: [number, number] = useMemo(() => {
    if (selectedField) return [selectedField.lat, selectedField.lng];
    if (fields.length > 0) return [fields[0].lat, fields[0].lng];
    return defaultCenter;
  }, [selectedField, fields]);

  const icon = useMemo(() => getCustomIcon(), []);

  if (typeof window === 'undefined') return null;

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      
      {fields.map((field) => (
        <Marker
          key={field.id}
          position={[field.lat, field.lng]}
          icon={icon || undefined}
          eventHandlers={{
            click: () => onSelectField(field),
          }}
        >
          <Popup className="custom-popup">
            <div className="p-1 min-w-[120px]">
              <div className="text-[10px] font-bold text-primary uppercase tracking-tighter mb-1">{field.crop} Sector</div>
              <h3 className="font-black text-foreground leading-none mb-2">{field.name}</h3>
              <div className="flex items-center justify-between gap-4 border-t pt-2">
                <div className="text-center">
                  <div className="text-[9px] text-muted-foreground uppercase font-bold">Health</div>
                  <div className="text-sm font-black text-emerald-600">{field.health}%</div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] text-muted-foreground uppercase font-bold">Moist</div>
                  <div className="text-sm font-black text-blue-600">{field.moisture}%</div>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      <MapUpdater center={center} />
    </MapContainer>
  );
}

