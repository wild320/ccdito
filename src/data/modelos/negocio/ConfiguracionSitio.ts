export class ConfiguracionSitio {
  address: string;
  email: string;
  phone: string;
  hours: string;
  scrmapa: string;
  VerProductosDestacados: boolean;
  VerMasVendidos: boolean;
  VerCategoriasPopulares: boolean;
  VerRecienllegados: boolean;
  VerUltimasNoticias: boolean;
  VerMarcas: boolean;
  VerBLoqueValoradosEspecialesVendidos: boolean;
  VerBannerIntermedio: boolean;
  VerBannerInformacion: boolean;
  VerAcordeonInformacion: boolean;
  VerWppIcono: boolean;
  NumeroWpp: number;
  PasaleraContraEntrega: boolean;
  PasaleraPSE: boolean;
  SuperarInventario: boolean;
  PasarelaTranferenciaBancaria: boolean;
  MostrarPreciosSinLogueo: boolean;
  CreacionDirectaClientes: boolean;
  PosicionamientoEnGoogle: string;
  VerSeguimientoPedidos: boolean;
  VerCompararProductos: boolean;
  VerContacto: boolean;
  VerNoticias: boolean;
  VerSuscribirse: boolean;
  scriptRastreo: string;
  AgenciaDefaul: string;
  AsesorPredeterminado: number;
  VerBontonAplicarCupon: boolean;
  VerFiltroMarcas: boolean;
  VerMarcaDetalleProducto: boolean;
  MensajePersonalizadoPago: string;

  constructor() {
      this.address = '';
      this.email = '';
      this.phone = '';
      this.hours = '';
      this.scrmapa = '';
      this.VerProductosDestacados = false;
      this.VerMasVendidos = false;
      this.VerCategoriasPopulares = false;
      this.VerRecienllegados = false;
      this.VerUltimasNoticias = false;
      this.VerMarcas = false;
      this.VerBLoqueValoradosEspecialesVendidos = false;
      this.VerBannerIntermedio = false;
      this.VerBannerInformacion = false;
      this.VerAcordeonInformacion = false;
      this.VerWppIcono = false;
      this.NumeroWpp = 0;
      this.PasaleraContraEntrega = false;
      this.PasaleraPSE = false;
      this.SuperarInventario = false;
      this.PasarelaTranferenciaBancaria = false;
      this.MostrarPreciosSinLogueo = false;
      this.CreacionDirectaClientes = false;
      this.PosicionamientoEnGoogle = '';
      this.VerSeguimientoPedidos = false;
      this.VerCompararProductos = false;
      this.VerContacto = false;
      this.VerNoticias = false;
      this.VerSuscribirse = false;
      this.scriptRastreo = '';
      this.AgenciaDefaul = '';
      this.AsesorPredeterminado = 0;
      this.VerBontonAplicarCupon = false;
      this.VerFiltroMarcas = false;
      this.VerMarcaDetalleProducto = false;
      this.MensajePersonalizadoPago = '';
  }
}
