/**
 * Interfaz Web Serial API para impresoras térmicas USB (ej. ZJ-58).
 * Uso:
 *   const printer = new ThermalPrinter();
 *   await printer.connect();
 *   await printer.write(bytes);
 *   await printer.disconnect();
 */
export class ThermalPrinter {
  constructor() {
    this.port = null;
    this.writer = null;
  }

  get isSupported() {
    return "serial" in navigator;
  }

  async connect() {
    if (!this.isSupported) {
      throw new Error("Web Serial API no está disponible en este navegador.");
    }
    this.port = await navigator.serial.requestPort();
    await this.port.open({ baudRate: 9600 });
    this.writer = this.port.writable.getWriter();
  }

  async write(bytes) {
    if (!this.writer) throw new Error("Impresora no conectada.");
    await this.writer.write(bytes);
  }

  async disconnect() {
    if (this.writer) {
      this.writer.releaseLock();
      this.writer = null;
    }
    if (this.port) {
      await this.port.close();
      this.port = null;
    }
  }
}
