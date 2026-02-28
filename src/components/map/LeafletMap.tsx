
"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import * as L from "leaflet";
import { useEffect, useMemo, memo } from "react";

// Optimized custom icon with reduced DOM nodes
const getCustomIcon = (color: string = 'hsl(var(--primary))') => {
  if (typeof window === 'undefined') return null;
  return new L.DivIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="w-8 h-8 bg-primary border-[4px] border-white rounded-full shadow-lg transition-transform hover:scale-110 z-20" style="background-color: ${color}"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
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

// Memoized Marker for performance with real-time updates
const FieldMarker = memo(({ field, icon, onClick }: { field: Field, icon: any, onClick: (f: Field) => void }) => (
  <Marker
    position={[field.lat, field.lng]}
    icon={icon || undefined}
    eventHandlers={{
      click: () => onClick(field),
    }}
  >
    <Popup className="custom-popup">
      <div className="p-1 min-w-[120px]">
        <div className="text-[10px] font-bold text-primary uppercase tracking-tighter mb-1">{field.crop} Sector</div>
        <h3 className="font-bold text-foreground leading-none mb-2">{field.name}</h3>
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
));
FieldMarker.displayName = 'FieldMarker';

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    // Using immediate setView for faster navigation feel
    map.setView(center, map.getZoom(), { animate: true, duration: 0.5 });
  }, [center, map]);
  return null;
}

function LeafletMap({ fields, onSelectField, selectedField }: LeafletMapProps) {
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
      preferCanvas={true} // Uses HTML5 Canvas for marker rendering (much faster)
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      
      {fields.map((field) => (
        <FieldMarker
          key={field.id}
          field={field}
          icon={icon}
          onClick={onSelectField}
        />
      ))}

      <MapUpdater center={center} />
    </MapContainer>
  );
}

export default memo(LeafletMap);
