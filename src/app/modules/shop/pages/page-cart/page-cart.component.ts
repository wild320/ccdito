import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';
import { UntypedFormControl, Validators } from '@angular/forms';
import { CartItem } from '../../../../shared/interfaces/cart-item';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { RootService } from '../../../../shared/services/root.service';
import { StoreService } from 'src/app/shared/services/store.service';

interface Item {
    cartItem: CartItem;
    quantity: number;
    quantityControl: UntypedFormControl;
}

@Component({
    selector: 'app-cart',
    templateUrl: './page-cart.component.html',
    styleUrls: ['./page-cart.component.scss']
})
export class PageCartComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject();

    removedItems: CartItem[] = [];
    items: Item[] = [];
    updating = false;
    disableProceedToPay: boolean = false;
    showCoupon!: boolean;

    constructor(
        public root: RootService,
        public cart: CartService,
        public storeSvc: StoreService,
    ) { 
        this.showCoupon = this.storeSvc.configuracionSitio.VerBontonAplicarCupon;
    }

    ngOnInit(): void {
        this.cart.items$.pipe(
          takeUntil(this.destroy$),
          map(cartItems => cartItems.map(cartItem => {
            return {
              cartItem,
              quantity: cartItem.quantity,
              quantityControl: new UntypedFormControl(cartItem.quantity, Validators.required),
              quantityError: false, // Inicializar quantityError como falso
              quantityErrorMessage: null
            };
          }))
          // tslint:disable-next-line: deprecation
        ).subscribe(items => {
          this.items = items;
          this.checkQuantity(this.items);
        });
      }


    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    remove(item: CartItem): void {
        if (this.removedItems.includes(item)) {
            return;
        }

        this.removedItems.push(item);
        // tslint:disable-next-line: deprecation
        // tslint:disable-next-line: deprecation
        this.cart.remove(item).subscribe({complete: () => this.removedItems = this.removedItems.filter(eachItem => eachItem !== item)});
    }


    checkQuantity(items: Item[]) {
        const allowExceedInventory = this.storeSvc.configuracionSitio.SuperarInventario;
    
        if (!allowExceedInventory) {
            items.forEach(item => {
                const inventory = item.cartItem.product.inventario;
                const inventoryRequest = item.cartItem.product.inventarioPedido;
                const quantity = item.quantity;
    
                const exceedsInventory = quantity > inventory - inventoryRequest;
    
                if (exceedsInventory) {
                    item.cartItem.quantityError = true;
                    item.cartItem.quantityErrorMessage = `Se superó el inventario, disponible: ${inventory - inventoryRequest} unidades`;
                } else {
                    item.cartItem.quantityError = false;
                    item.cartItem.quantityErrorMessage = null;
                }
            });
    
            const hasExceededInventory = items.some(item => item.cartItem.quantityError);
            this.disableProceedToPay = hasExceededInventory;
        } else {
            this.disableProceedToPay = false;
        }
    }
    
    

    update(): void {
        this.updating = true;
        this.cart.update(
            this.items
                .filter(item => item.quantityControl.value !== item.quantity)
                .map(item => ({
                    item: item.cartItem,
                    quantity: item.quantityControl.value,
                    quantityError: false, // Inicializar quantityError como falso
                    quantityErrorMessage: null
                }))
        // tslint:disable-next-line: deprecation
        ).subscribe({complete: () => this.updating = false});
    }

    needUpdate(): boolean {
        let needUpdate = false;

        for (const item of this.items) {
            if (!item.quantityControl.valid) {
                return false;
            }

            if (item.quantityControl.value !== item.quantity) {
                needUpdate = true;
            }
        }

        return needUpdate;
    }
}
