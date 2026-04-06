import { useCallback } from "react";
import { jsPDF } from "jspdf";
import { ThermalPrinter } from "../pos-print/ThermalPrinter";
import { buildTicketBytes, buildTicketData } from "../pos-print/TicketBuilder";

const LOGO_URL =
  "https://res.cloudinary.com/diitm4dx7/image/upload/v1737845955/logo_punto_azul_ah2ksi.png";

/**
 * Hook para imprimir tickets de pedido.
 * 1. Web Serial disponible → imprime en térmica (ZJ-58).
 * 2. Usuario cancela puerto o no hay térmica → genera PDF.
 */
export function usePrinter() {
  const printOrder = useCallback(async (order, isSeller) => {
    const printer = new ThermalPrinter();

    if (printer.isSupported) {
      try {
        await printer.connect();
        const bytes = buildTicketBytes(order, isSeller);
        await printer.write(bytes);
        await printer.disconnect();
        return;
      } catch (err) {
        if (err.name === "NotFoundError" || err.name === "NotSupportedError") {
          await printPdf(order, isSeller);
          return;
        }
        throw err;
      }
    }

    await printPdf(order, isSeller);
  }, []);

  return { printOrder };
}

// ─────────────────────────────────────────────────────────────
// PDF — réplica fiel de la vista en pantalla
// ─────────────────────────────────────────────────────────────

const W = 72;   // ancho del ticket en mm (rollo 80mm)
const M = 4;    // margen lateral

async function loadImageAsDataUrl(url) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function printPdf(order, isSeller) {
  const data = buildTicketData(order, isSeller);
  const logoData = await loadImageAsDataUrl(LOGO_URL);

  // Altura generosa; jsPDF no recorta — el visor la muestra igual
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [W, 280] });

  let y = 5;

  // helpers
  const cx = W / 2;
  const right = W - M;

  const txt = (str, opts = {}) => {
    const { align = "left", bold = false, size = 8, x: xo } = opts;
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(0, 0, 0);
    const xp = xo !== undefined ? xo : align === "center" ? cx : align === "right" ? right : M;
    doc.text(str, xp, y, { align });
    y += size * 0.42 + 0.5;
  };

  const dottedLine = () => {
    doc.setLineWidth(0.3);
    doc.setLineDash([0.8, 1.2]);
    doc.setDrawColor(0, 0, 0);
    doc.line(M, y, right, y);
    doc.setLineDash([]);
    y += 3;
  };

  const solidLine = (thin = false) => {
    doc.setLineWidth(thin ? 0.15 : 0.4);
    doc.setLineDash([]);
    doc.line(M, y, right, y);
    y += 2;
  };

  // ── Logo ──
  if (logoData) {
    const logoW = 28;
    const logoH = 28;
    doc.addImage(logoData, "PNG", cx - logoW / 2, y, logoW, logoH);
    y += logoH + 2;
  }

  // ── Encabezado ──
  txt("P & R MONSALVE", { align: "center", bold: true, size: 12 });
  y += 0.5;
  txt("El Manantial, Soledad-AT", { align: "center", size: 7.5 });
  txt("TEL: 322 9560143", { align: "center", size: 7.5 });
  y += 1;
  txt("¡Bienvenido!", { align: "center", size: 8 });
  y += 2;
  dottedLine();

  // ── Columnas tabla: Prod | Cant | P/unid | Sub-tot ──
  const colCant   = M + 30;   // x "Cant."
  const colPrice  = M + 44;   // x "P/unid."
  const colSub    = right;    // x "Sub-tot." (right)

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Prod.",  M,        y);
  doc.text("Cant.",  colCant,  y);
  doc.text("P/unid.", colPrice, y);
  doc.text("Sub-tot.", colSub,  y, { align: "right" });
  y += 5;
  solidLine(true);

  // ── Filas de productos ──
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  for (const item of data.items) {
    const maxNameW = colCant - M - 2;
    const nameLines = doc.splitTextToSize(item.name, maxNameW);
    doc.text(nameLines,             M,        y);
    doc.text(String(item.quantity), colCant,  y);
    doc.text(`$${item.price.toFixed(0)}`,    colPrice, y);
    doc.text(`$${item.subtotal.toFixed(0)}`, colSub,   y, { align: "right" });
    y += nameLines.length * 4 + 1;
  }

  // ── Fila SUB TOTAL — fondo oscuro ──
  const rowH = 6;
  doc.setFillColor(85, 85, 85); // #555
  doc.rect(M, y - 0.5, W - M * 2, rowH, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("SUB TOTAL", M + 2, y + rowH * 0.55);
  doc.text(`$${data.subtotal.toFixed(0)}`, right, y + rowH * 0.55, { align: "right" });
  doc.setTextColor(0, 0, 0);
  y += rowH + 2;

  // ── Fila Domicilio ──
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Domicilio",    M,        y);
  doc.text("1",            colCant,  y);
  doc.text(`$${data.deliveryCost.toFixed(0)}`, colPrice, y);
  doc.text(`$${data.deliveryCost.toFixed(0)}`, colSub,   y, { align: "right" });
  y += 5;

  // ── TOTAL A PAGAR ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("TOTAL A PAGAR", M, y);
  doc.setFontSize(10);
  doc.text(`$ ${data.total.toFixed(0)}`, right, y, { align: "right" });
  y += 6;
  dottedLine();

  // ── Datos de envío ──
  const infoRow = (label, value) => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(label, M, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(String(value || "-"), W - M * 2 - 20);
    doc.text(lines, M + 20, y);
    y += lines.length * 4 + 1;
  };

  infoRow("Cliente:",   data.buyer.name);
  infoRow("Direccion:", data.buyer.address);
  infoRow("Telefono:",  data.buyer.phone);
  infoRow("NOTA:",      data.note || "");
  infoRow("Fecha:",     data.date);
  y += 2;
  dottedLine();

  // ── Pie ──
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("!Gracias por su compra!", cx, y, { align: "center" });

  doc.autoPrint();
  const blob = doc.output("bloburl");
  window.open(blob, "_blank");
}
