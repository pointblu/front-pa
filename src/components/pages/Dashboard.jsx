import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const PIE_COLORS = {
  DELIVERED: "#2E7D32",
  REQUESTED: "#D4A017",
  ROUTED: "#6B3A00",
  CANCELED: "#C0392B",
  "SIN ESTADO": "#aaa",
};
const STATUS_LABEL = {
  DELIVERED: "Entregado",
  REQUESTED: "Solicitado",
  ROUTED: "En camino",
  CANCELED: "Cancelado",
  "SIN ESTADO": "Sin estado",
};
const fmt = (n) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

const KpiCard = ({ icon, label, value, color, sub }) => (
  <div className="col-6 col-md-3 mb-3">
    <div
      className="small-box"
      style={{ backgroundColor: color, color: "#fff", borderRadius: "8px", minHeight: "90px" }}
    >
      <div className="inner" style={{ padding: "12px 16px 4px" }}>
        <p style={{ fontSize: "0.7rem", margin: 0, opacity: 0.85 }}>{label}</p>
        <h4 style={{ margin: "2px 0", fontSize: "1.2rem", fontWeight: 700 }}>
          {value}
        </h4>
        {sub && (
          <p style={{ fontSize: "0.68rem", margin: 0, opacity: 0.8 }}>{sub}</p>
        )}
      </div>
      <div className="icon" style={{ opacity: 0.25 }}>
        <i className={`fas ${icon}`} style={{ fontSize: "3rem" }} />
      </div>
    </div>
  </div>
);

const CustomTooltipLine = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff8e7",
        border: "1px solid #D4A017",
        borderRadius: 6,
        padding: "6px 12px",
        fontSize: "0.8rem",
      }}
    >
      <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
      <p style={{ margin: 0, color: "#6B3A00" }}>{fmt(payload[0].value)}</p>
    </div>
  );
};

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    setStats(null);
    api
      .get("/Stats/dashboard")
      .then(({ data }) => setStats(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="content-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <p style={{ color: "#6B3A00" }}>Cargando estadísticas...</p>
      </div>
    );

  if (!stats)
    return (
      <div className="content-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#C0392B", marginBottom: "12px" }}>
            No se pudieron cargar las estadísticas.
          </p>
          <button
            onClick={fetchStats}
            style={{
              backgroundColor: "#D4A017",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "8px 20px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );

  const diasData = stats.ventasPorDia.map((d) => ({
    ...d,
    fechaLabel: (() => {
      try {
        return format(parseISO(d.fecha), "dd MMM", { locale: es });
      } catch {
        return d.fecha;
      }
    })(),
  }));

  const estadoData = stats.pedidosPorEstado.map((d) => ({
    ...d,
    label: STATUS_LABEL[d.status] ?? d.status,
    fill: PIE_COLORS[d.status] ?? "#aaa",
  }));

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <h1 className="m-0 App-header focus-in-contract alphi-5">
            Dashboard
          </h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          {/* KPI Cards */}
          <div className="row">
            <KpiCard
              icon="fa-shopping-cart"
              label="Ventas hoy"
              value={fmt(stats.ventasHoy.total)}
              sub={`${stats.ventasHoy.count} transacciones`}
              color="#D4A017"
            />
            <KpiCard
              icon="fa-calendar-alt"
              label="Ventas este mes"
              value={fmt(stats.ventasMes.total)}
              sub={`${stats.ventasMes.count} transacciones`}
              color="#6B3A00"
            />
            <KpiCard
              icon="fa-chart-line"
              label="Utilidad del mes"
              value={fmt(stats.utilidadMes)}
              color="#2E7D32"
            />
            <KpiCard
              icon="fa-users"
              label="Clientes activos"
              value={stats.totalClientes}
              color="#2E1A00"
            />
          </div>

          {/* Charts row */}
          <div className="row">
            {/* Ventas por día */}
            <div className="col-12 col-md-7 mb-4">
              <div
                className="card"
                style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
              >
                <div
                  className="card-header"
                  style={{ backgroundColor: "#fff8e7", borderBottom: "2px solid #D4A017" }}
                >
                  <h6 style={{ margin: 0, color: "#2E1A00", fontWeight: 700 }}>
                    <i className="fas fa-chart-line mr-2" style={{ color: "#D4A017" }} />
                    Ventas últimos 7 días
                  </h6>
                </div>
                <div className="card-body" style={{ padding: "12px 4px" }}>
                  {diasData.length === 0 ? (
                    <p className="text-center text-muted" style={{ padding: "2rem 0" }}>
                      Sin datos en los últimos 7 días
                    </p>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={diasData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0e0b0" />
                        <XAxis dataKey="fechaLabel" tick={{ fontSize: 11 }} />
                        <YAxis
                          tick={{ fontSize: 10 }}
                          tickFormatter={(v) =>
                            new Intl.NumberFormat("es-CO", {
                              notation: "compact",
                              currency: "COP",
                            }).format(v)
                          }
                        />
                        <Tooltip content={<CustomTooltipLine />} />
                        <Line
                          type="monotone"
                          dataKey="total"
                          stroke="#D4A017"
                          strokeWidth={2.5}
                          dot={{ fill: "#6B3A00", r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Pedidos por estado */}
            <div className="col-12 col-md-5 mb-4">
              <div
                className="card"
                style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
              >
                <div
                  className="card-header"
                  style={{ backgroundColor: "#fff8e7", borderBottom: "2px solid #6B3A00" }}
                >
                  <h6 style={{ margin: 0, color: "#2E1A00", fontWeight: 700 }}>
                    <i className="fas fa-clipboard-list mr-2" style={{ color: "#6B3A00" }} />
                    Pedidos por estado — mes actual
                  </h6>
                </div>
                <div className="card-body" style={{ padding: "12px 4px" }}>
                  {estadoData.length === 0 ? (
                    <p className="text-center text-muted" style={{ padding: "2rem 0" }}>
                      Sin pedidos este mes
                    </p>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={estadoData}
                          cx="50%"
                          cy="45%"
                          innerRadius={55}
                          outerRadius={85}
                          dataKey="count"
                          nameKey="label"
                          paddingAngle={3}
                        >
                          {estadoData.map((entry, idx) => (
                            <Cell key={idx} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [value, name]}
                          contentStyle={{ fontSize: "0.8rem", borderRadius: 6 }}
                        />
                        <Legend
                          formatter={(value) => (
                            <span style={{ fontSize: "0.75rem", color: "#2E1A00" }}>{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Top productos */}
          <div className="row">
            <div className="col-12 mb-4">
              <div
                className="card"
                style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
              >
                <div
                  className="card-header"
                  style={{ backgroundColor: "#fff8e7", borderBottom: "2px solid #C0392B" }}
                >
                  <h6 style={{ margin: 0, color: "#2E1A00", fontWeight: 700 }}>
                    <i className="fas fa-trophy mr-2" style={{ color: "#C0392B" }} />
                    Top 5 productos más vendidos — mes actual
                  </h6>
                </div>
                <div className="card-body" style={{ padding: "12px 4px" }}>
                  {stats.topProductos.length === 0 ? (
                    <p className="text-center text-muted" style={{ padding: "2rem 0" }}>
                      Sin ventas este mes
                    </p>
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={stats.topProductos}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0e0b0" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 10 }} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                          width={120}
                        />
                        <Tooltip
                          formatter={(value) => [`${value} uds.`, "Cantidad"]}
                          contentStyle={{ fontSize: "0.8rem", borderRadius: 6 }}
                        />
                        <Bar dataKey="quantity" fill="#C0392B" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
