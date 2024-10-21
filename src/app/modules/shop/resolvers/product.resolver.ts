import { inject } from '@angular/core';
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
  let cachedProduct = articulossvc.getArticuloDetalle()?.item;

  if (!cachedProduct && productSlug) {
    try {
      await articulossvc.SetSeleccionarArticuloDetalle(Number(productSlug), true);
      cachedProduct = articulossvc.getArticuloDetalle()?.item;

      if (!cachedProduct) {
        throw new Error(`Producto no encontrado para el slug ${productSlug}`);
      }

      // Aquí puedes configurar los meta tags
      const negocio = negocioSvc.configuracion;
      const { name, caracteristicas, brand, images, price, rating, inventario, urlAmigable, id } = cachedProduct;

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

    } catch (error) {
      console.error('Error fetching product details', error);
      return null;
    }
  }

  return cachedProduct;
};
