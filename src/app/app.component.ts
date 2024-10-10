import { DOCUMENT, isPlatformBrowser, ViewportScroller } from '@angular/common';
import { Component, Inject, NgZone, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter, first } from 'rxjs/operators';
import { Cconfiguracion } from 'src/data/contantes/cConfiguracion';
import { UtilsTexto } from '../app/shared/utils/UtilsTexto';
import { RootComponent } from './components/root/root.component';
import { BlocksModule } from './modules/blocks/blocks.module';
import { HeaderModule } from './modules/header/header.module';
import { MobileModule } from './modules/mobile/mobile.module';
import { ShopModule } from './modules/shop/shop.module';
import { UtilsModule } from './modules/utils/utils.module';
import { WidgetsModule } from './modules/widgets/widgets.module';
import { CartService } from './shared/services/cart.service';
import { CompareService } from './shared/services/compare.service';
import { CurrencyService } from './shared/services/currency.service';
import { NegocioService } from './shared/services/negocio.service';
import { StoreService } from './shared/services/store.service';
import { WishlistService } from './shared/services/wishlist.service';
import { SharedModule } from './shared/shared.module';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        BlocksModule, HeaderModule, MobileModule, ShopModule, SharedModule, WidgetsModule, UtilsModule, RootComponent, RouterModule, RouterLink, RouterOutlet
    ],
})
export class AppComponent implements OnInit {
    private title = signal<string>('');
    private urlImage = signal<string>('');
    private description = signal<string>('');
    private urlPublic = signal<string>('');

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(DOCUMENT) private document: Document,
        private router: Router,
        private toastr: ToastrService,
        private cart: CartService,
        private compare: CompareService,
        private wishlist: WishlistService,
        private zone: NgZone,
        private utils: UtilsTexto,
        private scroller: ViewportScroller,
        private currency: CurrencyService,
        private negocio: NegocioService,
        private titleService: Title,
        private storeService: StoreService,
        private metaService: Meta
    ) {
        
        this.storeService.configuracionSitio$.subscribe(config => {
            console.log("Configdel app", config);
            if(config){
                
            this.initializeTrackingScript(config);
            this.initializeMetaInfo(config);
            }
        });

        // Solo ejecuta scripts en el navegador
        if (isPlatformBrowser(this.platformId)) {
            this.setupPreloader();
        }
    }

    ngOnInit(): void {
        // Configura la moneda
        this.currency.options = {
            code: 'COP',
            display: 'code',
            digitsInfo: '1.0-2',
            locale: 'es-CO'
        };

        if (isPlatformBrowser(this.platformId)) {
            this.router.events.pipe(filter(event => event instanceof NavigationEnd))
                .subscribe(() => this.scroller.scrollToPosition([0, 0]));

            this.subscribeToCartEvents();
            this.subscribeToCompareEvents();
            this.subscribeToWishlistEvents();
        }
    }

    private initializeTrackingScript(config): void {
        if (config?.scriptRastreo) {
            const script = this.document.createElement('script');
            script.src = config.scriptRastreo;
            this.document.head.appendChild(script);
        }
    }

    private setupPreloader(): void {
        this.zone.runOutsideAngular(() => {
            this.router.events.pipe(filter(event => event instanceof NavigationEnd), first()).subscribe(() => {
                const preloader = this.document.querySelector('.site-preloader');
                if (preloader) {
                    preloader.addEventListener('transitionend', (event: TransitionEvent) => {
                        if (event.propertyName === 'opacity') {
                            preloader.remove();
                        }
                    });
                    preloader.classList.add('site-preloader__fade');
                }
            });
        });
    }

    private initializeMetaInfo(config): void {
        if (config) {
            const nombreCliente = this.negocio.configuracion.NombreCliente || '[Carro Compras]';
            const descripcionGoogle = config.PosicionamientoEnGoogle || 'Descripción predeterminada';
            const logoUrl = `${this.negocio.configuracion.BaseUrl}${Cconfiguracion.urlAssetsConfiguracion}${this.negocio.configuracion.Logo}`;
            console.log(logoUrl);
            this.title.set(nombreCliente);
            this.description.set(descripcionGoogle);
            this.urlImage.set(logoUrl);

            // Establecer título y metatags dinámicamente
            this.titleService.setTitle(nombreCliente);
            this.setMetaTags(descripcionGoogle, nombreCliente, logoUrl);
        }
    }

    private setMetaTags(description: string, title: string, imageUrl: string): void {
        this.metaService.updateTag({ name: 'description', content: description });
        this.metaService.updateTag({ property: 'og:title', content: title });
        this.metaService.updateTag({ property: 'og:description', content: description });
        this.metaService.updateTag({ property: 'og:image', content: imageUrl });
        this.metaService.updateTag({ property: 'og:url', content: this.urlPublic() });
        this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.metaService.updateTag({ name: 'twitter:title', content: title });
        this.metaService.updateTag({ name: 'twitter:description', content: description });
        this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });
    }

    private subscribeToCartEvents(): void {
        this.cart.onAdding$.subscribe(product => {
            this.toastr.success(`Producto "${this.utils.TitleCase(product.name)}" agregado al carrito!`);
        });
    }

    private subscribeToCompareEvents(): void {
        this.compare.onAdding$.subscribe(product => {
            this.toastr.success(`Producto "${this.utils.TitleCase(product.name)}" agregado para comparar!`);
        });
    }

    private subscribeToWishlistEvents(): void {
        this.wishlist.onAdding$.subscribe(product => {
            this.toastr.success(`Producto "${this.utils.TitleCase(product.name)}" agregado a la lista de deseos!`);
        });
    }
}
