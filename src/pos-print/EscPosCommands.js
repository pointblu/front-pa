/**
 * Comandos ESC/POS para impresoras térmicas.
 * Retorna Uint8Array con los bytes de cada comando.
 */

const ESC = 0x1b;
const GS  = 0x1d;
const LF  = 0x0a;

export const EscPos = {
  /** Inicializar impresora */
  init: () => new Uint8Array([ESC, 0x40]),

  /** Avance de línea */
  feed: (lines = 1) => new Uint8Array([ESC, 0x64, lines]),

  /** Corte de papel (corte completo) */
  cut: () => new Uint8Array([GS, 0x56, 0x00]),

  /** Alineación: 0=izquierda, 1=centro, 2=derecha */
  align: (n) => new Uint8Array([ESC, 0x61, n]),

  /** Negrita on/off */
  bold: (on) => new Uint8Array([ESC, 0x45, on ? 1 : 0]),

  /** Tamaño de fuente: 0=normal, 1=doble ancho, 2=doble alto, 3=doble ancho+alto */
  fontSize: (size) => {
    const map = { 0: 0x00, 1: 0x10, 2: 0x01, 3: 0x11 };
    return new Uint8Array([GS, 0x21, map[size] ?? 0x00]);
  },

  /** Texto plano (Latin-1 / CP850 compatible) */
  text: (str) => {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      bytes.push(code > 127 ? 0x3f : code); // reemplaza no-ASCII con '?'
    }
    bytes.push(LF);
    return new Uint8Array(bytes);
  },

  /** Pulso cajón de dinero (pin 2) */
  cashDrawer: () => new Uint8Array([ESC, 0x70, 0x00, 0x19, 0x78]),

  /** Une múltiples Uint8Array en uno solo */
  concat: (...arrays) => {
    const total = arrays.reduce((s, a) => s + a.length, 0);
    const result = new Uint8Array(total);
    let offset = 0;
    for (const arr of arrays) {
      result.set(arr, offset);
      offset += arr.length;
    }
    return result;
  },
};
