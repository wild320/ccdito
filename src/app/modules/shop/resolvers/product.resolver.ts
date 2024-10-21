import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import type { ResolveFn } from '@angular/router';
import { ArticulosService } from 'src/app/shared/services/articulos.service';
import { NegocioService } from 'src/app/shared/services/negocio.service';
import { Item } from 'src/data/modelos/articulos/Items';

export const productResolver: ResolveFn<Item> = async (route, state) => {
  const articulossvc = inject(ArticulosService);
  const negocioSvc = inject(NegocioService);
  const metaTagService = inject(Meta);
  const titleService = inject(Title);

  const productSlug = route.paramMap.get('productSlug');

  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) {

    let cachedProduct = articulossvc.getArticuloDetalle()?.item;
    if (!cachedProduct && productSlug) {
      await articulossvc.SetSeleccionarArticuloDetalle(Number(productSlug), true);

      const negocio = negocioSvc.configuracion;
      const { name, caracteristicas, brand, images, price, rating, inventario, urlAmigable, id } = articulossvc.getArticuloDetalle()?.item;
     // cachedProduct = articulossvc.getArticuloDetalle()?.item;

      titleService.setTitle(`${negocio.NombreCliente} | ${name}`);
      const description = caracteristicas || 'Compra este producto de alta calidad al mejor precio.';
      const title = `${name} - ${brand?.['name'] || 'Marca Desconocida'} - Disponible en nuestra tienda`;
      const keywords = `${name}, ${brand?.['name']}, precio, comprar, ${rating} estrellas, ${inventario} en stock, ${price}`;
      const imageUrl = images?.length ? images[0] : `${negocio.baseUrl}assets/configuracion/LOGO2.png`;

      metaTagService.addTags([
        { name: 'description', content: description },
        { name: 'title', content: title },
        { name: 'keywords', content: keywords },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: imageUrl },
        { property: 'og:url', content: `${negocio.baseUrl}/shop/products/${id}/${urlAmigable}` },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: imageUrl }
      ]);
    }


    console.log("resolverw", articulossvc.getArticuloDetalle()?.item)
    return cachedProduct;
  }


};
