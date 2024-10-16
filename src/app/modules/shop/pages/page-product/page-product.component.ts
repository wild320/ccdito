import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../../../shared/api/shop.service';
import { Link } from '../../../../shared/interfaces/link';

// servicios
import { ArticulosService } from '../../../../shared/services/articulos.service';

// modelos
import { Meta, Title } from '@angular/platform-browser';
import { Item } from '../../../../../data/modelos/articulos/Items';
import { NegocioService } from 'src/app/shared/services/negocio.service';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
    selector: 'app-page-product',
    templateUrl: './page-product.component.html',
    styleUrls: ['./page-product.component.scss']
})
export class PageProductComponent implements OnInit {
    relatedProducts: Item[];
    product: Item;
    ArticulosSuscribe$: any;
    breadcrumbs: Link[] = [];
    layout: 'standard' | 'columnar' | 'sidebar' = 'standard';
    sidebarPosition: 'start' | 'end' = 'start'; // For LTR scripts "start" is "left" and "end" is "right"
    private cadenaString: string = "";
    private valorProductoUnit: any;
    private productSlug: string | null;
    constructor(
        private shop: ShopService,
        private route: ActivatedRoute,
        public articulossvc: ArticulosService,
        
        private negocio: NegocioService,
        private titleService: Title,
        public StoreSvc: StoreService,
        private metaTagService: Meta,
    ) { 
        this.productSlug = this.route.snapshot.params['productSlug'] || this.route.snapshot.data['productSlug'] || null;

        this.route.data.subscribe(data => {
            const negocio = this.negocio.configuracion;
            const StoreSvc = this.StoreSvc.configuracionSitio;
            this.titleService.setTitle(negocio.NombreCliente);
            
            this.layout = data['layout'] || this.layout;
            this.sidebarPosition = data['sidebarPosition'] || this.sidebarPosition;
        });
    }

    ngOnInit(): void {

        this.route.data.subscribe((data) => {
            // The resolver provides the product details here
            const resolvedProduct = data['product'];
            if (resolvedProduct) {
                this.product = resolvedProduct;
                this.setMetaTags();
                // this.SetBreadcrumbs(resolvedProduct.breadcrumbs);
            }

            // Fetch related products separately
            // this.articulossvc.RecuperarArticulosRelacionados(Number(this.productSlug));
            // this.articulossvc.getArticulosRelacionados$().subscribe(relatedProducts => {
            //     this.relatedProducts = relatedProducts;
            // });
        });

        // this.route.paramMap.subscribe(data => {

        //     console.log(data)

        //     this.ArticulosSuscribe$ = this.articulossvc.getArticuloDetalle$().subscribe(Data => {
        //         this.product = this.articulossvc.getArticuloDetalle().item;

        //         // if (this.product) {
        //         //     this.setMetaTags();
        //         //     this.cadenaString = this.product.name;
        //         //     this.valorProductoUnit = this.product.price;

        //         //     const regExp = /\(([^)]+)\)/;
        //         //     const matches = regExp.exec(this.cadenaString);

        //         //     if (matches) {
        //         //         const [valorUnitario, nombreUnidadV] = matches[1].split(' ');

        //         //         // Calcular valor por unidad
        //         //         const valor = parseInt(this.valorProductoUnit, 10) / parseInt(valorUnitario, 10);
        //         //         this.product["ValorUnidadV"] = `${valor}`;
        //         //         this.product["NombreUnidadV"] = nombreUnidadV;
        //         //     }
        //         // } else {
        //         //     this.articulossvc.SetSeleccionarArticuloDetalle(Number(this.productSlug), true);
        //         // }

        //         // this.SetBreadcrumbs(this.articulossvc.getArticuloDetalle().breadcrumbs);
        //     });

        //     // this.articulossvc.SetSeleccionarArticuloDetalle(Number(this.productSlug), false);
        //     // this.articulossvc.RecuperarArticulosRelacionados(Number(this.getProductoSlug()));

        //     // // tslint:disable-next-line: deprecation

        //     // this.articulossvc.getArticulosRelacionados$().subscribe(data => {
        //     //     this.relatedProducts = this.articulossvc.getArticulosRelacionados();
        //     // });

        // });


    }

    SetBreadcrumbs(breadcrumbs: any[]) {

        // this.shop.SetBreadcrumbs(breadcrumbs);
        // this.shop.SetBreadcrumb(this.product?.name, '');

        // this.breadcrumbs = this.shop.breadcrumbs;

    }





    setMetaTags(): void {
        
        const { name, caracteristicas, brand, images, price, rating, inventario, urlAmigable, id } = this.product;

        const baseHref = this.negocio.configuracion.baseUrl;

        // Set meta description (use 'caracteristicas' or a default value)
        const description = caracteristicas || 'Compra este producto de alta calidad al mejor precio.';

        // Set meta title
        const title = `${name} - ${brand?.['name'] || 'Marca Desconocida'} - Disponible en nuestra tienda`;

        // Set meta keywords (e.g., name, brand, product details)
        const keywords = `${name}, ${brand?.['name']}, precio, comprar, ${rating} estrellas, ${inventario} en stock, ${price}`;

        // Set product image for Open Graph and Twitter Cards
        const imageUrl = images?.length ? images[0] : `${baseHref}/assets/configuracion/LOGO2.png`;

        // Update the meta tags
        this.metaTagService.updateTag({ name: 'description', content: description });
        this.metaTagService.updateTag({ name: 'title', content: title });
        this.metaTagService.updateTag({ name: 'keywords', content: keywords });

        // Open Graph meta tags for social sharing
        this.metaTagService.updateTag({ property: 'og:title', content: title });
        this.metaTagService.updateTag({ property: 'og:description', content: description });
        this.metaTagService.updateTag({ property: 'og:image', content: imageUrl });
        this.metaTagService.updateTag({ property: 'og:url', content: `${baseHref}/shop/products/${id}/${urlAmigable}` });

        // Twitter Card meta tags
        this.metaTagService.updateTag({ name: 'twitter:title', content: title });
        this.metaTagService.updateTag({ name: 'twitter:description', content: description });
        this.metaTagService.updateTag({ name: 'twitter:image', content: imageUrl });
    }

}
