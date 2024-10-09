import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { CartService } from './shared/services/cart.service';
import { CompareService } from './shared/services/compare.service';
import { WishlistService } from './shared/services/wishlist.service';


import { CommonModule, DOCUMENT, isPlatformBrowser, ViewportScroller } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { CurrencyService } from './shared/services/currency.service';

import { NegocioService } from './shared/services/negocio.service';

// utils
import { UtilsTexto } from '../app/shared/utils/UtilsTexto';
import { RootComponent } from './components/root/root.component';
import { BlocksModule } from './modules/blocks/blocks.module';
import { HeaderModule } from './modules/header/header.module';
import { MobileModule } from './modules/mobile/mobile.module';
import { UtilsModule } from './modules/utils/utils.module';
import { WidgetsModule } from './modules/widgets/widgets.module';
import { StoreService } from './shared/services/store.service';
import { SharedModule } from './shared/shared.module';
import { ShopModule } from './modules/shop/shop.module';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        BlocksModule,
        HeaderModule,
        MobileModule,
        ShopModule,
        SharedModule,
        WidgetsModule,
        UtilsModule, RootComponent, RouterModule, RouterLink, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

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
        public StoreSvc: StoreService,
        private metaTagService: Meta
    ) {

        this.titleService.setTitle(this.negocio.configuracion.NombreCliente);
        
        this.setMetaTags();

        if (isPlatformBrowser(this.platformId)) {
            eval(this.StoreSvc?.configuracionSitio?.scriptRastreo)

            this.zone.runOutsideAngular(() => {
                this.router.events.pipe(filter(event => event instanceof NavigationEnd), first()).subscribe(() => {
                    const preloader = document.querySelector('.site-preloader');

                    preloader.addEventListener('transitionend', (event: TransitionEvent) => {
                        if (event.propertyName === 'opacity') {
                            preloader.remove();
                        }
                    });
                    preloader.classList.add('site-preloader__fade');
                });
            });
        }

    }

    TitleCase(texto) {
        texto = texto.toLowerCase().replace(/\b[a-z]/g, txt => {
            return txt.toUpperCase();
        });

        return texto;
    }

    ngOnInit(): void {
        // properties of the CurrencyFormatOptions interface fully complies
        // with the arguments of the built-in pipe "currency"
        // https://angular.io/api/common/CurrencyPipe
        this.currency.options = {
            code: 'COP',
            display: 'code',
            digitsInfo: '1.0-2',
            // locale: 'en-US'
        };

        this.router.events.subscribe((event) => {
            if ((event instanceof NavigationEnd)) {
                this.scroller.scrollToPosition([0, 0]);
            }
        });
        this.cart.onAdding$.subscribe(product => {
            this.toastr.success(`Producto "${this.utils.TitleCase(product.name)}" Agregado al Carrito!`);
        });
        this.compare.onAdding$.subscribe(product => {
            this.toastr.success(`Producto "${this.utils.TitleCase(product.name)}" Agregado para Comparar!`);
        });
        this.wishlist.onAdding$.subscribe(product => {
            this.toastr.success(`Producto "${this.TitleCase(product.name)}" Agregado a la Lista de Deseos!`);
        });

        // this.metaTagService.addTags([
        //     { name: 'description', content: 'Demo Carro Mágico, la mejor tienda online para encontrar productos mágicos y únicos. Descubre nuestras ofertas.' },
        //     { name: 'keywords', content: 'carro mágico, tienda online, ecommerce, productos mágicos, ofertas, compra online' },
        //     { name: 'author', content: 'Demo Carro Mágico' },
        //     { name: 'robots', content: 'index, follow' },
        //     { property: 'og:title', content: 'Demo Carro Mágico - Tienda Online' },
        //     { property: 'og:description', content: 'Bienvenido a Demo Carro Mágico, tu tienda de productos mágicos y sorprendentes.' },
        //     { property: 'og:type', content: 'website' },
        //     { property: 'og:url', content: 'https://copiacarro--magico-mundo.us-central1.hosted.app/' },
        //     { property: 'og:image', content: 'https://copiacarro--magico-mundo.us-central1.hosted.app/assets/configuracion/LOGO2.png' },
        //     { name: 'twitter:card', content: 'summary_large_image' },
        //     { name: 'twitter:title', content: 'Demo Carro Mágico - Tienda Online de Productos Mágicos' },
        //     { name: 'twitter:description', content: 'Explora productos únicos y ofertas especiales en Demo Carro Mágico.' },
        //     { name: 'twitter:image', content: 'https://copiacarro--magico-mundo.us-central1.hosted.app/assets/configuracion/LOGO2.png' },
        //   ]);
    }

    private setMetaTags(): void {
        const { configuracionSitio } = this.StoreSvc;
        const { redes } = this.StoreSvc;

    
        // Validar que configuracionSitio esté definido antes de agregar las meta tags
        if (configuracionSitio) {
            this.metaTagService.addTags([
                // Meta generales
                { name: 'description', content: configuracionSitio.PosicionamientoEnGoogle || '' },
                { name: 'author', content: configuracionSitio.email || '' },
                { name: 'address', content: configuracionSitio.address || '' },
                { name: 'phone', content: configuracionSitio.phone || '' },
                { name: 'hours', content: configuracionSitio.hours || '' },
    
                // Meta para redes sociales (Open Graph)
                { property: 'og:title', content: this.negocio.configuracion.NombreCliente },
                { property: 'og:description', content: configuracionSitio.PosicionamientoEnGoogle || '' },
                { property: 'og:type', content: 'website' },
                { property: 'og:url', content: document.location.href },
                { property: 'og:email', content: configuracionSitio.email || '' },
                { property: 'og:phone_number', content: configuracionSitio.phone || '' },
                { property: 'og:address', content: configuracionSitio.address || '' },
                { property: 'og:hours', content: configuracionSitio.hours || '' },
                { property: 'og:image', content: document.location.href + '/assets/configuracion/LOGO2.png' }, // Cambiar si tienes una imagen representativa
                
                // Meta para WhatsApp o contacto
                { name: 'contact:phone_number', content: configuracionSitio.NumeroWpp.toString() || '' },
                
                // Meta para Twitter
                { name: 'twitter:card', content:'summary_large_image' },
                { name: 'twitter:site', content: '@' + redes[1].url || '' },
                { name: 'twitter:creator', content: '@' + redes[1].url || '' },
                { name: 'twitter:title', content: this.negocio.configuracion.NombreCliente },
                { name: 'twitter:description', content: configuracionSitio.PosicionamientoEnGoogle || '' },
                { name: 'twitter:image', content: document.location.href + '/assets/configuracion/LOGO2.png' }, // Cambiar si tienes una imagen representativa
                
                // Meta para Facebook
                { property: 'fb:app_id', content: redes[1].url || '' },
                { property: 'fb:pages', content: redes[1].url || '' },
                { property: 'og:site_name', content: this.negocio.configuracion.NombreCliente },
                { property: 'og:description', content: configuracionSitio.PosicionamientoEnGoogle || '' },
                { property: 'og:image', content: document.location.href + '/assets/configuracion/LOGO2.png' },

                // Meta para instagram
                { name: 'instagram:username', content: 'magicomundo.co' },
                { name: 'og:image:width', content: '640' },
                { name: 'og:image:height', content: '640' },
            ]);
        } else {
            console.error('No se encontró la configuración del sitio.');
        }
    }
    
}

