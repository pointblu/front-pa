class Operacion {
  constructor(nombre, argumentos) {
    this.nombre = nombre;
    this.argumentos = argumentos;
  }
}

class ConectorPluginV3 {
  static URL_PLUGIN_POR_DEFECTO = "http://localhost:8000";
  static Operacion = Operacion;
  static TAMAÑO_IMAGEN_NORMAL = 0;
  static TAMAÑO_IMAGEN_DOBLE_ANCHO = 1;
  static TAMAÑO_IMAGEN_DOBLE_ALTO = 2;
  static TAMAÑO_IMAGEN_DOBLE_ANCHO_Y_ALTO = 3;
  static ALINEACION_IZQUIERDA = 0;
  static ALINEACION_CENTRO = 1;
  static ALINEACION_DERECHA = 2;
  static RECUPERACION_QR_BAJA = 0;
  static RECUPERACION_QR_MEDIA = 1;
  static RECUPERACION_QR_ALTA = 2;
  static RECUPERACION_QR_MEJOR = 3;

  constructor(ruta, serial) {
    if (!ruta) ruta = ConectorPluginV3.URL_PLUGIN_POR_DEFECTO;
    if (!serial) serial = "";
    this.ruta = ruta;
    this.serial = serial;
    this.operaciones = [];
    return this;
  }

  CargarImagenLocalEImprimir(ruta, tamaño, maximoAncho) {
    this.operaciones.push(
      new Operacion("CargarImagenLocalEImprimir", Array.from(arguments))
    );
    return this;
  }
  Corte(lineas) {
    this.operaciones.push(new Operacion("Corte", Array.from(arguments)));
    return this;
  }
  CorteParcial() {
    this.operaciones.push(new Operacion("CorteParcial", Array.from(arguments)));
    return this;
  }
  DefinirCaracterPersonalizado(caracterRemplazo, matriz) {
    this.operaciones.push(
      new Operacion("DefinirCaracterPersonalizado", Array.from(arguments))
    );
    return this;
  }
  DescargarImagenDeInternetEImprimir(urlImagen, tamaño, maximoAncho) {
    this.operaciones.push(
      new Operacion("DescargarImagenDeInternetEImprimir", Array.from(arguments))
    );
    return this;
  }
  DeshabilitarCaracteresPersonalizados() {
    this.operaciones.push(
      new Operacion(
        "DeshabilitarCaracteresPersonalizados",
        Array.from(arguments)
      )
    );
    return this;
  }
  DeshabilitarElModoDeCaracteresChinos() {
    this.operaciones.push(
      new Operacion(
        "DeshabilitarElModoDeCaracteresChinos",
        Array.from(arguments)
      )
    );
    return this;
  }
  EscribirTexto(texto) {
    this.operaciones.push(
      new Operacion("EscribirTexto", Array.from(arguments))
    );
    return this;
  }
  EstablecerAlineacion(alineacion) {
    this.operaciones.push(
      new Operacion("EstablecerAlineacion", Array.from(arguments))
    );
    return this;
  }
  EstablecerEnfatizado(enfatizado) {
    this.operaciones.push(
      new Operacion("EstablecerEnfatizado", Array.from(arguments))
    );
    return this;
  }
  EstablecerFuente(fuente) {
    this.operaciones.push(
      new Operacion("EstablecerFuente", Array.from(arguments))
    );
    return this;
  }
  EstablecerImpresionAlReves(alReves) {
    this.operaciones.push(
      new Operacion("EstablecerImpresionAlReves", Array.from(arguments))
    );
    return this;
  }
  EstablecerImpresionBlancoYNegroInversa(invertir) {
    this.operaciones.push(
      new Operacion(
        "EstablecerImpresionBlancoYNegroInversa",
        Array.from(arguments)
      )
    );
    return this;
  }
  EstablecerRotacionDe90Grados(rotar) {
    this.operaciones.push(
      new Operacion("EstablecerRotacionDe90Grados", Array.from(arguments))
    );
    return this;
  }
  EstablecerSubrayado(subrayado) {
    this.operaciones.push(
      new Operacion("EstablecerSubrayado", Array.from(arguments))
    );
    return this;
  }
  EstablecerTamañoFuente(multiplicadorAncho, multiplicadorAlto) {
    this.operaciones.push(
      new Operacion("EstablecerTamañoFuente", Array.from(arguments))
    );
    return this;
  }
  Feed(lineas) {
    this.operaciones.push(new Operacion("Feed", Array.from(arguments)));
    return this;
  }
  HabilitarCaracteresPersonalizados() {
    this.operaciones.push(
      new Operacion("HabilitarCaracteresPersonalizados", Array.from(arguments))
    );
    return this;
  }
  HabilitarElModoDeCaracteresChinos() {
    this.operaciones.push(
      new Operacion("HabilitarElModoDeCaracteresChinos", Array.from(arguments))
    );
    return this;
  }
  ImprimirCodigoDeBarrasCodabar(contenido, alto, ancho, tamañoImagen) {
    this.operaciones.push(
      new Operacion("ImprimirCodigoDeBarrasCodabar", Array.from(arguments))
    );
    return this;
  }

  ImprimirCodigoDeBarrasCode128(contenido, alto, ancho, tamañoImagen) {
    this.operaciones.push(
      new Operacion("ImprimirCodigoDeBarrasCode128", Array.from(arguments))
    );
    return this;
  }
  ImprimirCodigoDeBarrasCode39(
    contenido,
    incluirSumaDeVerificacion,
    modoAsciiCompleto,
    alto,
    ancho,
    tamañoImagen
  ) {
    this.operaciones.push(
      new Operacion("ImprimirCodigoDeBarrasCode39", Array.from(arguments))
    );
    return this;
  }

  ImprimirCodigoDeBarrasCode93(contenido, alto, ancho, tamañoImagen) {
    this.operaciones.push(
      new Operacion("ImprimirCodigoDeBarrasCode93", Array.from(arguments))
    );
    return this;
  }

  ImprimirCodigoDeBarrasEan(contenido, alto, ancho, tamañoImagen) {
    this.operaciones.push(
      new Operacion("ImprimirCodigoDeBarrasEan", Array.from(arguments))
    );
    return this;
  }
  ImprimirCodigoDeBarrasEan8(contenido, alto, ancho, tamañoImagen) {
    this.operaciones.push(
      new Operacion("ImprimirCodigoDeBarrasEan8", Array.from(arguments))
    );
    return this;
  }
  ImprimirCodigoDeBarrasPdf417(
    contenido,
    nivelSeguridad,
    alto,
    ancho,
    tamañoImagen
  ) {
    this.operaciones.push(
      new Operacion("ImprimirCodigoDeBarrasPdf417", Array.from(arguments))
    );
    return this;
  }
  ImprimirCodigoDeBarrasTwoOfFiveITF(
    contenido,
    intercalado,
    alto,
    ancho,
    tamañoImagen
  ) {
    this.operaciones.push(
      new Operacion("ImprimirCodigoDeBarrasTwoOfFiveITF", Array.from(arguments))
    );
    return this;
  }
  ImprimirCodigoDeBarrasUpcA(contenido, alto, ancho, tamañoImagen) {
    this.operaciones.push(
      new Operacion("ImprimirCodigoDeBarrasUpcA", Array.from(arguments))
    );
    return this;
  }
  ImprimirCodigoDeBarrasUpcE(contenido, alto, ancho, tamañoImagen) {
    this.operaciones.push(
      new Operacion("ImprimirCodigoDeBarrasUpcE", Array.from(arguments))
    );
    return this;
  }
  ImprimirCodigoQr(contenido, anchoMaximo, nivelRecuperacion, tamañoImagen) {
    this.operaciones.push(
      new Operacion("ImprimirCodigoQr", Array.from(arguments))
    );
    return this;
  }
  ImprimirImagenEnBase64(imagenCodificadaEnBase64, tamaño, maximoAncho) {
    this.operaciones.push(
      new Operacion("ImprimirImagenEnBase64", Array.from(arguments))
    );
    return this;
  }

  Iniciar() {
    this.operaciones.push(new Operacion("Iniciar", Array.from(arguments)));
    return this;
  }

  Pulso(pin, tiempoEncendido, tiempoApagado) {
    this.operaciones.push(new Operacion("Pulso", Array.from(arguments)));
    return this;
  }

  TextoSegunPaginaDeCodigos(numeroPagina, pagina, texto) {
    this.operaciones.push(
      new Operacion("TextoSegunPaginaDeCodigos", Array.from(arguments))
    );
    return this;
  }

  static async obtenerImpresoras(ruta) {
    if (ruta) ConectorPluginV3.URL_PLUGIN_POR_DEFECTO = ruta;
    const response = await fetch(
      ConectorPluginV3.URL_PLUGIN_POR_DEFECTO + "/impresoras"
    );
    return await response.json();
  }

  static async obtenerImpresorasRemotas(ruta, rutaRemota) {
    if (ruta) ConectorPluginV3.URL_PLUGIN_POR_DEFECTO = ruta;
    const response = await fetch(
      ConectorPluginV3.URL_PLUGIN_POR_DEFECTO + "/reenviar?host=" + rutaRemota
    );
    return await response.json();
  }

  async imprimirEnImpresoraRemota(nombreImpresora, rutaRemota) {
    const payload = {
      operaciones: this.operaciones,
      nombreImpresora,
      serial: this.serial,
    };
    const response = await fetch(this.ruta + "/reenviar?host=" + rutaRemota, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return await response.json();
  }

  async imprimirEn(nombreImpresora) {
    const payload = {
      operaciones: this.operaciones,
      nombreImpresora,
      serial: this.serial,
    };
    const response = await fetch(this.ruta + "/imprimir", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return await response.json();
  }
}

// Aquí exportas la clase ConectorPluginV3 como exportación predeterminada
export default ConectorPluginV3;
