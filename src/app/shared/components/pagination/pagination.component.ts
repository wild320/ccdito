import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PaginationComponent),
            multi: true
        }
    ]
})
export class PaginationComponent implements OnChanges, OnInit, ControlValueAccessor  {
    @Input() siblings = 1;
    @Input() current = 1;
    @Input() total: number = 1;

    @Output() pageChange: EventEmitter<number> = new EventEmitter();

    pages: number[] = [];

    onChange: any = () => {};
    onTouched: any = () => {};

    constructor() { }

    ngOnInit(): void {
        this.calc();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.calc();
    }

    setPage(value: number, emitEvent: boolean = true): void {
        this.onTouched();

        if (value < 1 || value > this.total || value === this.current) {
            return;
        }

        if (this.current !== value) {
            this.onChange(value);
        }

        this.current = value;

        if (emitEvent) {
            this.pageChange.emit(this.current);
        }

    }

    trackByFn(index: number): number {
        return index;
    }

    private calc(): void {

        const min = 1;
        const max = Math.min(this.total);

        this.pages = [];

        for (let i = min; i <= max; i++) {
            this.pages.push(i);
        }

    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    writeValue(obj: any): void {
        if (typeof obj === 'number') {
            this.setPage(obj, false);
        }
    }
}
