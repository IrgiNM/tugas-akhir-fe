"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

type GeoMapProps = {
  lat: number;
  lon: number;
};

export default function GeoMap({ lat, lon }: GeoMapProps) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return (
      <div className="w-full h-[250px] flex items-center justify-center rounded-xl border border-[#353b6c] bg-[#0c0b20] text-gray-400">
        Lokasi tidak tersedia
      </div>
    );
  }

  return (
    <div className="w-full h-[250px] overflow-hidden rounded-xl">
      <MapContainer
        center={[lat, lon]}
        zoom={15}
        className="w-full h-full"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lon]}>
          <Popup>Detected Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}