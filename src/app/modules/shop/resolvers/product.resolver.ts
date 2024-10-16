import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { ArticulosService } from 'src/app/shared/services/articulos.service';
import { Item } from 'src/data/modelos/articulos/Items';

export const productResolver: ResolveFn<Item | null> = async (route, state) => {
  const articulossvc = inject(ArticulosService);
  const productSlug = route.paramMap.get('productSlug'); // Obtener el parámetro de la URL

  // Intentar obtener el producto desde el servicio (si ya está cargado en memoria)
  let cachedProduct = articulossvc.getArticuloDetalle()?.item;

  console.log("cachedProduct", cachedProduct);

  if (!cachedProduct && productSlug) {
    try {
      // Hacer la petición HTTP para obtener el detalle del producto si no está cacheado
      await articulossvc.SetSeleccionarArticuloDetalle(Number(productSlug), true);
      cachedProduct = articulossvc.getArticuloDetalle()?.item;

      console.log("fetchedProduct", cachedProduct);

      // Verificar si el producto fue correctamente recuperado
      if (!cachedProduct) {
        throw new Error(`Producto no encontrado para el slug ${productSlug}`);
      }
    } catch (error) {
      console.error('Error fetching product details', error);
      return null; // Manejar el error devolviendo null
    }
  }

  return cachedProduct || null; // Devolver el producto cacheado o recuperado
};
