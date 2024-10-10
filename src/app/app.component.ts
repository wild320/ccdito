import { Component, Inject, NgZone, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { CartService } from './shared/services/cart.service';
import { CompareService } from './shared/services/compare.service';
import { WishlistService } from './shared/services/wishlist.service';
import { DOCUMENT, isPlatformBrowser, ViewportScroller } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { CurrencyService } from './shared/services/currency.service';
import { NegocioService } from './shared/services/negocio.service';
import { UtilsTexto } from '../app/shared/utils/UtilsTexto';
import { StoreService } from './shared/services/store.service';
import { RootComponent } from './components/root/root.component';
import { BlocksModule } from './modules/blocks/blocks.module';
import { HeaderModule } from './modules/header/header.module';
import { MobileModule } from './modules/mobile/mobile.module';
import { ShopModule } from './modules/shop/shop.module';
import { UtilsModule } from './modules/utils/utils.module';
import { WidgetsModule } from './modules/widgets/widgets.module';
import { SharedModule } from './shared/shared.module';
import { Cconfiguracion } from 'src/data/contantes/cConfiguracion';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [BlocksModule,
        HeaderModule,
        MobileModule,
        ShopModule,
        SharedModule,
        WidgetsModule,
        UtilsModule, RootComponent, RouterModule, RouterLink, RouterOutlet
    ],
})
export class AppComponent implements OnInit {
    title = signal<string>('');         // Inicia con una cadena vacía
    urlImage = signal<string>('');      // Inicia con una cadena vacía
    description = signal<string>('');   // Inicia con una cadena vacía
    urlPublic = signal<string>('');     // Inicia con una cadena vacía

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
        public storeService: StoreService,
        private metaService: Meta
    ) {      

        if (isPlatformBrowser(this.platformId)) {
            this.initializeTrackingScript();
            this.setupPreloader();
        }
    }

    ngOnInit(): void {
        
        this.initializeMetaInfo();

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

    private initializeTrackingScript(): void {
        if (this.storeService?.configuracionSitio?.scriptRastreo) {
            // Se recomienda evitar eval(); intenta cargar el script de forma segura.
            // Por ejemplo, añadiendo un script al DOM dinámicamente
            const script = this.document.createElement('script');
            script.text = this.storeService.configuracionSitio.scriptRastreo;
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

    private initializeMetaInfo(): void {
        if (this.storeService.configuracionSitio) {
            this.title.set(this.negocio.configuracion.NombreCliente || '[Carro Compras]');
            this.description.set(this.storeService.configuracionSitio.PosicionamientoEnGoogle || 'Descripción predeterminada');
            this.urlImage.set( `${this.negocio.configuracion.BaseUrl}${Cconfiguracion.urlAssetsConfiguracion}${this.negocio.configuracion.Logo}`);
    
            this.titleService.setTitle(this.title() || '');
            this.setMetaTags();
        }
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

    private setMetaTags(): void {
        this.metaService.addTags([
            { name: 'description', content: this.description() },
            { name: 'og:title', content: this.title() },
            { name: 'og:description', content: this.description() },
            { name: 'og:image', content: this.urlImage() },
            { name: 'og:url', content: this.urlPublic() },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: this.title() },
            { name: 'twitter:description', content: this.description() },
            { name: 'twitter:image', content: this.urlImage() },
        ]);
    }
}
