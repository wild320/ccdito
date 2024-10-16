import { Component, makeStateKey, OnInit, TransferState } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NegocioService } from 'src/app/shared/services/negocio.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { Item } from '../../../../../data/modelos/articulos/Items';
import { ShopService } from '../../../../shared/api/shop.service';
import { Link } from '../../../../shared/interfaces/link';
import { ArticulosService } from '../../../../shared/services/articulos.service';

const PRODUCT_KEY = makeStateKey<Item>('product');

@Component({
    selector: 'app-page-product',
    templateUrl: './page-product.component.html',
    styleUrls: ['./page-product.component.scss']
})
export class PageProductComponent implements OnInit {
    relatedProducts: Item[] = [];
    product: Item | null = null;
    ArticulosSuscribe$: any;
    breadcrumbs: Link[] = [];
    layout: 'standard' | 'columnar' | 'sidebar' = 'standard';
    sidebarPosition: 'start' | 'end' = 'start';
    private cadenaString: string = "";
    private valorProductoUnit: any;
    private productSlug: string | null;

    constructor(
        private shop: ShopService,
        private route: ActivatedRoute,
        public articulossvc: ArticulosService,
        private transferState: TransferState,
        private negocio: NegocioService,
        private titleService: Title,
        public StoreSvc: StoreService,
        private metaTagService: Meta,
    ) {
        this.productSlug = this.route.snapshot.params['productSlug'] || null;

        this.route.data.subscribe(data => {
            
            const resolvedProduct = data['product'];

            this.layout = data['layout'] || this.layout;

            this.sidebarPosition = data['sidebarPosition'] || this.sidebarPosition;

            const negocioConfig = this.negocio.configuracion;

            if (resolvedProduct) {
                this.product = resolvedProduct;
                this.setupProductDetails();
                this.setMetaTags(negocioConfig);
            } else {
                this.articulossvc.SetSeleccionarArticuloDetalle(Number(this.productSlug), true);
            }

            this.articulossvc.RecuperarArticulosRelacionados(Number(this.productSlug));
            this.articulossvc.getArticulosRelacionados$().subscribe(relatedProducts => {
                this.relatedProducts = relatedProducts;
            });
        });
    }

    ngOnInit(): void {
        this.articulossvc.getArticuloDetalle$().subscribe(Data => {
            console.log("Observador", Data);
            //this.product = this.articulossvc.getArticuloDetalle().item;
        });

    }

    private setupProductDetails(): void {
        this.cadenaString = this.product.name;
        this.valorProductoUnit = this.product.price;

        const regExp = /\(([^)]+)\)/;
        const matches = regExp.exec(this.cadenaString);

        if (matches) {
            const [valorUnitario, nombreUnidadV] = matches[1].split(' ');

            const valor = parseInt(this.valorProductoUnit, 10) / parseInt(valorUnitario, 10);
            this.product["ValorUnidadV"] = `${valor}`;
            this.product["NombreUnidadV"] = nombreUnidadV;
        }

        this.SetBreadcrumbs(this.articulossvc.getArticuloDetalle().breadcrumbs);
        this.transferState.set(PRODUCT_KEY, this.product);
        this.articulossvc.SetSeleccionarArticuloDetalle(Number(this.productSlug), false);
    }

    SetBreadcrumbs(breadcrumbs: any[]): void {
        this.shop.SetBreadcrumbs(breadcrumbs);
        this.shop.SetBreadcrumb(this.product?.name, '');

        this.breadcrumbs = this.shop.breadcrumbs;
    }

    setMetaTags(negocio): void {
        if (!this.product) return alert("Esperando Porducto"); // Verifica que el producto esté disponible

        const { name, caracteristicas, brand, images, price, rating, inventario, urlAmigable, id } = this.product;

        this.titleService.setTitle(`${negocio.NombreCliente} | ${name}`);

        const baseHref = this.negocio.configuracion.baseUrl;
        const description = caracteristicas || 'Compra este producto de alta calidad al mejor precio.';
        const title = `${name} - ${brand?.['name'] || 'Marca Desconocida'} - Disponible en nuestra tienda`;
        const keywords = `${name}, ${brand?.['name']}, precio, comprar, ${rating} estrellas, ${inventario} en stock, ${price}`;
        const imageUrl = images?.length ? images[0] : `${baseHref}assets/configuracion/LOGO2.png`;

        this.metaTagService.updateTag({ name: 'description', content: description });
        this.metaTagService.updateTag({ name: 'title', content: title });
        this.metaTagService.updateTag({ name: 'keywords', content: keywords });
        this.metaTagService.updateTag({ property: 'og:title', content: title });
        this.metaTagService.updateTag({ property: 'og:description', content: description });
        this.metaTagService.updateTag({ property: 'og:image', content: imageUrl });
        this.metaTagService.updateTag({ property: 'og:url', content: `${baseHref}/shop/products/${id}/${urlAmigable}` });
        this.metaTagService.updateTag({ name: 'twitter:title', content: title });
        this.metaTagService.updateTag({ name: 'twitter:description', content: description });
        this.metaTagService.updateTag({ name: 'twitter:image', content: imageUrl });
    }
}
