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
  private httpClient = inject(HttpClient);
  public configuracion: any;
  private UrlJsonConfguracion: string = "https://copiacarro--magico-mundo.us-central1.hosted.app/" + Cconfiguracion.urlAssetsConfiguracion + Cconfiguracion.JsonConfiguracion;
  public UrlServicioCarroCompras: string = '';

  async loadSettingsFromServer(): Promise<any> {
    const options = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
      })
    };

    try {
      const config = await firstValueFrom(this.httpClient.get<any>(this.UrlJsonConfguracion, options));
      this.configuracion = config;
      this.UrlServicioCarroCompras = `${this.configuracion.UrlServicioCarroCompras}${CServicios.ApiCarroCompras}${CServicios.ServicioConfiguracionCC}`;

    } catch (err) {
      console.error('Error leyendo json de configuracion:', err);
    }
  }

}
