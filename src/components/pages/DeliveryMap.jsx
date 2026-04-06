import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import api from "../../services/api";
import { toast } from "sonner";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const destinationIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 15);
  }, [coords, map]);
  return null;
}

export function DeliveryMap() {
  const { purchaseId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    api.get(`/Purchases/${purchaseId}`)
      .then(({ data }) => setOrder(data))
      .catch(() => toast.error("No se pudo cargar el pedido"));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords([pos.coords.latitude, pos.coords.longitude]),
        () => {},
      );
    }
  }, [purchaseId]);

  // Parse buyer coordinates (stored as strings in the DB)
  const buyerLat = parseFloat(order?.buyer?.latitude ?? "0");
  const buyerLng = parseFloat(order?.buyer?.longitude ?? "0");
  const hasCoords = buyerLat !== 0 && buyerLng !== 0;

  const defaultCenter = hasCoords
    ? [buyerLat, buyerLng]
    : [10.9171, -74.7830]; // Soledad, Atlántico

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
        <button className="ican-button" onClick={() => navigate(-1)} title="Volver">
          <i className="fas fa-arrow-left nav-icon" />
        </button>
        <h5 style={{ margin: 0 }}>
          Mapa — {order?.buyer?.name ?? "Cargando..."}
        </h5>
      </div>

      {order && (
        <div style={{ marginBottom: "0.75rem", fontSize: "0.875rem" }}>
          <strong>Dirección:</strong> {order.buyer?.address ?? "-"} &nbsp;|&nbsp;
          <strong>Teléfono:</strong> {order.buyer?.phone ?? "-"} &nbsp;|&nbsp;
          <strong>Total:</strong> ${order.total?.toFixed(0)}
          {order.note && <><br /><strong>Nota:</strong> {order.note}</>}
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={14}
        style={{ height: "60vh", width: "100%", borderRadius: "8px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hasCoords && (
          <>
            <FlyTo coords={[buyerLat, buyerLng]} />
            <Marker position={[buyerLat, buyerLng]} icon={destinationIcon}>
              <Popup>
                <strong>Destino</strong><br />
                {order?.buyer?.name}<br />
                {order?.buyer?.address}
              </Popup>
            </Marker>
          </>
        )}

        {userCoords && (
          <Marker position={userCoords}>
            <Popup><strong>Tu ubicación</strong></Popup>
          </Marker>
        )}
      </MapContainer>

      {!hasCoords && (
        <p style={{ marginTop: "0.5rem", color: "#888", fontSize: "0.8rem" }}>
          El cliente no tiene coordenadas registradas. Se muestra la ciudad por defecto.
        </p>
      )}
    </div>
  );
}
