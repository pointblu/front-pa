import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet icon con webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Centro por defecto: C.C. Nuestro Atlántico, Soledad, Atlántico
const DEFAULT_CENTER = [10.9178, -74.7682];

function DraggableMarker({ position, onMove }) {
  useMapEvents({
    click(e) {
      onMove([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend(e) {
          const { lat, lng } = e.target.getLatLng();
          onMove([lat, lng]);
        },
      }}
    />
  ) : null;
}

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`,
      { headers: { "Accept-Language": "es" } }
    );
    const data = await res.json();
    return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

export function MapPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);

  const handleMove = async (pos) => {
    setPosition(pos);
    setLoading(true);
    const addr = await reverseGeocode(pos[0], pos[1]);
    setAddress(addr);
    setLoading(false);
    onLocationSelect({ lat: pos[0], lng: pos[1], address: addr });
  };

  const handleGPS = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = [coords.latitude, coords.longitude];
        setPosition(pos);
        if (mapRef.current) mapRef.current.setView(pos, 16);
        reverseGeocode(pos[0], pos[1]).then((addr) => {
          setAddress(addr);
          setLoading(false);
          onLocationSelect({ lat: pos[0], lng: pos[1], address: addr });
        });
      },
      () => setLoading(false)
    );
  };

  return (
    <div style={{ marginTop: "1.2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <h5 style={{ margin: 0, fontSize: "0.95rem" }}>
          <i className="fas fa-map-marker-alt" style={{ color: "#e74c3c", marginRight: "0.4rem" }} />
          Dirección de entrega
        </h5>
        <button
          type="button"
          onClick={handleGPS}
          className="btn btn-sm btn-outline-secondary"
          style={{ fontSize: "0.75rem" }}
        >
          <i className="fas fa-crosshairs" style={{ marginRight: "4px" }} />
          Mi ubicación
        </button>
      </div>

      <p style={{ fontSize: "0.75rem", color: "#888", marginBottom: "0.4rem" }}>
        Haz clic en el mapa o arrastra el marcador para ajustar tu dirección.
      </p>

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={15}
        style={{ height: "220px", width: "100%", borderRadius: "8px", zIndex: 1 }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker position={position} onMove={handleMove} />
      </MapContainer>

      <div style={{ marginTop: "0.6rem" }}>
        <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#555" }}>
          Dirección detectada
        </label>
        <input
          type="text"
          className="form-control form-control-sm"
          value={loading ? "Obteniendo dirección..." : address}
          onChange={(e) => {
            setAddress(e.target.value);
            if (position)
              onLocationSelect({ lat: position[0], lng: position[1], address: e.target.value });
          }}
          placeholder="Clic en el mapa para seleccionar"
          style={{ marginTop: "0.25rem", fontSize: "0.8rem" }}
        />
      </div>
    </div>
  );
}
