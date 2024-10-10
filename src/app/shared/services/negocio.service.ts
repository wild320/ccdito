import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

// Contantes
import { Cconfiguracion } from '../../../data/contantes/cConfiguracion';
import { CServicios } from 'src/data/contantes/cServicios';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NegocioService {

  httpClient = inject(HttpClient);

  headers: HttpHeaders = new HttpHeaders();

  UrlJsonConfguracion: string;

  UrlServicioCarroCompras: string;

  configuracion: any = {};

  constructor() {
    this.UrlJsonConfguracion = Cconfiguracion.urlAssetsConfiguracion + Cconfiguracion.JsonConfiguracion;
  }


  async loadSettingsFromServer(): Promise<any> {
    this.headers = this.headers.append('Access-Control-Allow-Origin', '*');

    const options = {
      headers: this.headers
    };

    try {
      const config: any = await firstValueFrom(this.httpClient.get(this.UrlJsonConfguracion, options));
      console.log(config);
      this.configuracion = config;
      this.UrlServicioCarroCompras = `${this.configuracion.UrlServicioCarroCompras}${CServicios.ApiCarroCompras}${CServicios.ServicioConfiguracionCC}`;
    } catch (err) {
      console.error('Error leyendo json de configuracion:', err);
    }
  }

}
