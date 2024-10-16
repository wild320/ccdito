import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NegocioService } from 'src/app/shared/services/negocio.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { Item } from '../../../../../data/modelos/articulos/Items';
import { ShopService } from '../../../../shared/api/shop.service';
import { Link } from '../../../../shared/interfaces/link';
import { ArticulosService } from '../../../../shared/services/articulos.service';

@Component({
    selector: 'app-page-product',
    templateUrl: './page-product.component.html',
    styleUrls: ['./page-product.component.scss']
})
export class PageProductComponent {
    relatedProducts: Item[] = [];
    product: Item | null = null;
    ArticulosSuscribe$: any;
    breadcrumbs: Link[] = [];
    layout: 'standard' | 'columnar' | 'sidebar' = 'standard';
    sidebarPosition: 'start' | 'end' = 'start';
    private cadenaString: string = "";
    private valorProductoUnit: any;
    private productSlug: string | null;
    negocioConfig: any;

    constructor(
        private shop: ShopService,
        private route: ActivatedRoute,
        public articulossvc: ArticulosService,
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

            this.negocioConfig = this.negocio.configuracion;

            if (resolvedProduct) {
                this.product = resolvedProduct;
                this.setupProductDetails();
                this.setMetaTags();
            }

            this.articulossvc.RecuperarArticulosRelacionados(Number(this.productSlug));
            this.articulossvc.getArticulosRelacionados$().subscribe(relatedProducts => {
                this.relatedProducts = relatedProducts;
            });
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

    }

    SetBreadcrumbs(breadcrumbs: any[]): void {
        this.shop.SetBreadcrumbs(breadcrumbs);
        this.shop.SetBreadcrumb(this.product?.name, '');

        this.breadcrumbs = this.shop.breadcrumbs;
    }

    setMetaTags(): void {

        const negocio = this.negocioConfig;

        const { name, caracteristicas, brand, images, price, rating, inventario, urlAmigable, id } = this.product;

        this.titleService.setTitle(`${negocio.NombreCliente} | ${name}`);

        const baseHref = this.negocio.configuracion.baseUrl;
        const description = caracteristicas || 'Compra este producto de alta calidad al mejor precio.';
        const title = `${name} - ${brand?.['name'] || 'Marca Desconocida'} - Disponible en nuestra tienda`;
        const keywords = `${name}, ${brand?.['name']}, precio, comprar, ${rating} estrellas, ${inventario} en stock, ${price}`;
        const imageUrl = images?.length ? images[0] : `${baseHref}assets/configuracion/LOGO2.png`;

        this.metaTagService.addTags([
            { name: 'description', content: description },
            { name: 'title', content: title },
            { name: 'keywords', content: keywords },
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:image', content: imageUrl },
            { property: 'og:url', content: `${baseHref}/shop/products/${id}/${urlAmigable}` },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description },
            { name: 'twitter:image', content: imageUrl }
        ]);
    }
}
