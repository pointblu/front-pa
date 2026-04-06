import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { toast, Toaster } from "sonner";
import { useAuth } from "../../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DEFAULT_LAT = 10.9171;
const DEFAULT_LNG = -74.783;

function MapClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function ConfigPanel() {
  const auth = useAuth();
  const navigate = useNavigate();
  const userObject = JSON.parse(auth.getUser() || "{}");
  const isAdmin = auth.isAuthenticated && userObject.role === "ADMIN";

  const [config, setConfig] = useState({
    delivery_cost: "",
    business_address: "",
    business_lat: String(DEFAULT_LAT),
    business_lng: String(DEFAULT_LNG),
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) { navigate("/"); return; }

    api.get("/config")
      .then(({ data }) =>
        setConfig({
          delivery_cost: data.delivery_cost ?? "1000",
          business_address: data.business_address ?? "",
          business_lat: data.business_lat ?? String(DEFAULT_LAT),
          business_lng: data.business_lng ?? String(DEFAULT_LNG),
        })
      )
      .catch(() => toast.error("Error al cargar configuración"));
  }, [isAdmin, navigate]);

  const handleSave = async (key, value) => {
    setSaving(true);
    try {
      const { data } = await api.put(`/config/${key}`, { value });
      setConfig((c) => ({
        ...c,
        delivery_cost: data.delivery_cost ?? c.delivery_cost,
        business_address: data.business_address ?? c.business_address,
        business_lat: data.business_lat ?? c.business_lat,
        business_lng: data.business_lng ?? c.business_lng,
      }));
      toast.success("Configuración guardada");
    } catch {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLocation = async (lat, lng) => {
    setSaving(true);
    try {
      await api.put("/config/business_lat", { value: String(lat) });
      const { data } = await api.put("/config/business_lng", { value: String(lng) });
      setConfig((c) => ({
        ...c,
        business_lat: String(lat),
        business_lng: String(lng),
        delivery_cost: data.delivery_cost ?? c.delivery_cost,
        business_address: data.business_address ?? c.business_address,
      }));
      toast.success("Ubicación del negocio guardada");
    } catch {
      toast.error("Error al guardar ubicación");
    } finally {
      setSaving(false);
    }
  };

  const handleMapPick = useCallback(
    (lat, lng) => {
      setConfig((c) => ({ ...c, business_lat: String(lat), business_lng: String(lng) }));
      handleSaveLocation(lat, lng);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (!isAdmin) return null;

  const lat = parseFloat(config.business_lat) || DEFAULT_LAT;
  const lng = parseFloat(config.business_lng) || DEFAULT_LNG;

  return (
    <div className="content-wrapper">
    <div style={{ padding: "1.5rem", maxWidth: "620px" }}>
      <Toaster position="top-center" richColors />
      <h4>Configuración del negocio</h4>

      {/* Delivery cost */}
      <div className="card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
        <label style={{ fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
          Valor del domicilio ($)
        </label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="number"
            className="form-control form-control-sm custom-input-form"
            value={config.delivery_cost}
            onChange={(e) => setConfig((c) => ({ ...c, delivery_cost: e.target.value }))}
            min={0}
            style={{ maxWidth: "160px" }}
          />
          <button
            className="btn btn-sm btn-success"
            disabled={saving}
            onClick={() => handleSave("delivery_cost", config.delivery_cost)}
          >
            Guardar
          </button>
        </div>
        <small style={{ color: "#666" }}>Costo que se suma al total del pedido por domicilio.</small>
      </div>

      {/* Business address label */}
      <div className="card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
        <label style={{ fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
          Nombre / dirección del negocio
        </label>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            type="text"
            className="form-control form-control-sm custom-input-form"
            value={config.business_address}
            onChange={(e) => setConfig((c) => ({ ...c, business_address: e.target.value }))}
            placeholder="Ej: El Manantial, Soledad-AT"
            style={{ minWidth: "240px" }}
          />
          <button
            className="btn btn-sm btn-success"
            disabled={saving}
            onClick={() => handleSave("business_address", config.business_address)}
          >
            Guardar
          </button>
        </div>
        <small style={{ color: "#666" }}>Etiqueta visible en tickets e información del negocio.</small>
      </div>

      {/* Business location map */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <label style={{ fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
          Ubicación del negocio en el mapa
        </label>
        <small style={{ color: "#666", display: "block", marginBottom: "0.5rem" }}>
          Haz clic en el mapa para fijar la ubicación del negocio. Lat: {lat.toFixed(5)}, Lng: {lng.toFixed(5)}
        </small>
        <MapContainer
          key={`${lat}-${lng}`}
          center={[lat, lng]}
          zoom={15}
          style={{ height: "340px", width: "100%", borderRadius: "8px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onPick={handleMapPick} />
          <Marker position={[lat, lng]}>
            <Popup>
              <strong>{config.business_address || "Negocio"}</strong><br />
              {lat.toFixed(5)}, {lng.toFixed(5)}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
    </div>
  );
}
