import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { MobileMenuItem } from '../../../../shared/interfaces/mobile-menu-item';

@Component({
    selector: 'app-mobile-links',
    templateUrl: './mobile-links.component.html',
    styleUrls: ['./mobile-links.component.scss']
})
export class MobileLinksComponent implements OnInit {
    @Input() links: MobileMenuItem[] = [];
    @Input() level = 0;

    @Output() itemClick: EventEmitter<MobileMenuItem> = new EventEmitter();

    constructor( @Inject(PLATFORM_ID) private platformId: Object,) {}

    ngOnInit(): void {
        if(isPlatformBrowser(this.platformId)) {

            // Se olbiga a usar setTimeout porque los links de categorias se demora en llegar
            setTimeout(() => {
                this.sortGrandchildrenAlphabetically();
            }, 6000);
        }
    }

    onItemClick(item: MobileMenuItem): void {
        this.itemClick.emit(item);
    }

    private sortGrandchildrenAlphabetically(): void {
        this.links.forEach(link => {
            if (link.label === 'Categorias' && link.children) {
                link.children.forEach(child => {
                    if (child.children) {
                        child.children.sort((a, b) => a.label.localeCompare(b.label));
                    }
                });
            }
        });
    }
}
