
"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import * as L from "leaflet";
import { useEffect } from "react";

// Fix Leaflet marker icon issues in Next.js
const customIcon = typeof window !== 'undefined' ? new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div class="w-10 h-10 bg-primary border-[6px] border-white rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95 z-20"></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
}) : null;

type Field = {
  id: string;
  name: string;
  crop: string;
  yield: string;
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
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

export default function LeafletMap({ fields, onSelectField, selectedField }: LeafletMapProps) {
  // Center map on fields or a default location
  const center: [number, number] = selectedField 
    ? [selectedField.lat, selectedField.lng] 
    : [fields[0].lat, fields[0].lng];

  if (typeof window === 'undefined') return null;

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      
      {fields.map((field) => (
        <Marker
          key={field.id}
          position={[field.lat, field.lng]}
          icon={customIcon || undefined}
          eventHandlers={{
            click: () => onSelectField(field),
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-sm">{field.name}</h3>
              <p className="text-xs text-muted-foreground">{field.crop}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {selectedField && <MapUpdater center={[selectedField.lat, selectedField.lng]} />}
    </MapContainer>
  );
}
