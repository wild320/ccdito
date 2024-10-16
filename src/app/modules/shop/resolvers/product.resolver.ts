import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { ArticulosService } from 'src/app/shared/services/articulos.service';
import { Item } from 'src/data/modelos/articulos/Items';

export const productResolver: ResolveFn<Item | null> = async (route, state) => {
  const articulossvc = inject(ArticulosService); 
  const productSlug = route.paramMap.get('productSlug'); // Obtener el parámetro de la URL

  // Intentar obtener el producto desde el servicio (si ya está cargado en memoria)
  const cachedProduct = articulossvc.getArticuloDetalle()?.item;

  console.log("cachedProduct", cachedProduct)

  if (cachedProduct) {
    return cachedProduct; // Devolver el producto si ya está cargado en el servicio
  }

  // Si no hay producto en el servicio, hacer la petición HTTP
  if (productSlug) {
    try {
      // Hacer la petición HTTP para obtener el detalle del producto
      await articulossvc.SetSeleccionarArticuloDetalle(Number(productSlug), true);
      const fetchedProduct = articulossvc.getArticuloDetalle()?.item;

      console.log("fetchedProduct", fetchedProduct)

      return fetchedProduct || null; // Devolver el producto recuperado o null si no existe
    } catch (error) {
      console.error('Error fetching product details', error);
      return null; // Manejar el error devolviendo null
    }
  }

  return null; // Devolver null si no hay `productSlug`
};
