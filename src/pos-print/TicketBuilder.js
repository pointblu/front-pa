import { EscPos } from "./EscPosCommands";

const SEPARATOR = "--------------------------------";
const SEPARATOR_THIN = "................................";

/**
 * Construye los bytes ESC/POS del ticket a partir de los datos del pedido.
 * @param {object} order  - objeto Purchase completo
 * @param {boolean} isSeller - si true, el domicilio = $0
 * @returns {Uint8Array}
 */
export function buildTicketBytes(order, isSeller) {
  const deliveryCost = isSeller ? 0 : 1000;
  const total = order.total + deliveryCost;
  const date = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).format(new Date(order.createdAt));

  const parts = [
    EscPos.init(),
    // ── Encabezado ──
    EscPos.align(1),
    EscPos.bold(true),
    EscPos.fontSize(3),
    EscPos.text("P & R MONSALVE"),
    EscPos.fontSize(0),
    EscPos.bold(false),
    EscPos.text("Ciudad Bonita, Soledad - AT"),
    EscPos.text("Tel: 322 9560143"),
    EscPos.feed(1),
    EscPos.text(SEPARATOR),
    EscPos.bold(true),
    EscPos.text("TICKET DE PEDIDO"),
    EscPos.bold(false),
    EscPos.text(`Fecha: ${date}`),
    EscPos.text(`Pedido #${order.id ?? "-"}`),
    EscPos.text(SEPARATOR),
    // ── Productos ──
    EscPos.align(0),
    EscPos.bold(true),
    EscPos.text("CANT  PRODUCTO              SUBTOTAL"),
    EscPos.bold(false),
    EscPos.text(SEPARATOR),
  ];

  for (const item of order.prDetail) {
    if (item.product.name === "DOMICILIO") continue;
    const name = item.product.name.substring(0, 20).padEnd(20);
    const qty = String(item.quantity).padStart(3);
    const sub = item.active
      ? `$${item.subtotal.toFixed(0)}`
      : "$0";
    parts.push(EscPos.text(`${qty}   ${name} ${sub}`));
  }

  parts.push(
    EscPos.text(SEPARATOR),
    // ── Totales ──
    EscPos.align(2),
    EscPos.text(`Subtotal:   $${order.total.toFixed(0)}`),
    EscPos.text(`Domicilio:  $${deliveryCost.toFixed(0)}`),
    EscPos.bold(true),
    EscPos.fontSize(1),
    EscPos.text(`TOTAL:  $${total.toFixed(0)}`),
    EscPos.fontSize(0),
    EscPos.bold(false),
    // ── Datos de envío ──
    EscPos.align(0),
    EscPos.text(SEPARATOR),
    EscPos.bold(true),
    EscPos.text("DATOS DE ENVIO"),
    EscPos.bold(false),
    EscPos.text(`Cliente:   ${order.buyer.name}`),
    EscPos.text(`Direccion: ${order.buyer.address}`),
    EscPos.text(`Telefono:  ${order.buyer.phone}`),
  );

  if (order.note) {
    parts.push(EscPos.text(`Nota:      ${order.note}`));
  }

  parts.push(
    EscPos.text(SEPARATOR_THIN),
    EscPos.align(1),
    EscPos.bold(true),
    EscPos.text("!Gracias por su compra!"),
    EscPos.bold(false),
    EscPos.feed(3),
    EscPos.cut(),
  );

  return EscPos.concat(...parts);
}

/**
 * Datos estructurados del ticket para el fallback PDF.
 */
export function buildTicketData(order, isSeller) {
  const deliveryCost = isSeller ? 0 : 1000;
  const date = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).format(new Date(order.createdAt));

  const items = order.prDetail.filter((i) => i.product.name !== "DOMICILIO");

  return {
    date,
    orderId: order.id ?? "-",
    items: items.map((i) => ({
      name: i.product.name,
      quantity: i.quantity,
      price: i.active ? i.product.price : 0,
      subtotal: i.active ? i.subtotal : 0,
    })),
    subtotal: order.total,
    deliveryCost,
    total: order.total + deliveryCost,
    buyer: {
      name: order.buyer.name,
      address: order.buyer.address,
      phone: order.buyer.phone,
    },
    note: order.note,
    paymentType: order.paymentType,
  };
}
