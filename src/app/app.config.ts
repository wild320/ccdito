import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, PLATFORM_ID, importProvidersFrom } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { WINDOW, windowProvider } from './providers/window';
import { routes } from './routes';
import { BannerService } from './shared/services/banner.service';
import { NegocioService } from './shared/services/negocio.service';
import { StoreService } from './shared/services/store.service';
import { UsuarioService } from './shared/services/usuario.service';

export function CargarConfiguracion(
  configLocal: NegocioService,
  configGeneral: StoreService,
  usuario: UsuarioService,
  banner: BannerService
) {
  return async (): Promise<any> => {
    try {
      // Carga los datos de cada servicio en orden
      await configLocal.loadSettingsFromServer();
      await configGeneral.cargarConfiguracionGeneral();
      await usuario.cargarUsuarioStorage();
      // await banner.cargarBanner(); // Descomentar si es necesario
    } catch (error) {
      console.error('Error al cargar la configuración:', error);
      throw error; // Para asegurarse de que el APP_INITIALIZER falle si algo no carga correctamente
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideToastr(),
    provideHttpClient(withFetch()),
    importProvidersFrom(BrowserAnimationsModule),
    {
      provide: APP_INITIALIZER,
      useFactory: CargarConfiguracion,
      multi: true,
      deps: [NegocioService, StoreService, UsuarioService, BannerService],
    },
    { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [PLATFORM_ID] },
    {
      provide: WINDOW,
      useFactory: (document: Document) => windowProvider(document),
      deps: [DOCUMENT],
    },
  ],
};

export function getBaseUrl(platformId: Object) {
  if (isPlatformBrowser(platformId)) {
    return document.getElementsByTagName('base')[0]?.href || '/';
  } else {
    return '/'; // Valor por defecto para SSR
  }
}
