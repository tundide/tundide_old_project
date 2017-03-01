import {
    Component, Input, ElementRef, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, Renderer, AfterViewInit,
    trigger,
    state,
    style,
    transition,
    animate
} from '@angular/core';

@Component({
    animations: [
        trigger('statusChange', [
            state('false', style({ transform: 'translateX(-33.333%)' })),
            state('true', style({ transform: 'translateX(0)' })),
            transition('true <=> false', animate('200ms'))
        ])
    ],
    selector: 'switch',
    styleUrls: ['switch.component.scss'],
    templateUrl: './switch.component.html'
})
export class SwitchComponent implements OnChanges, AfterViewInit {



    @ViewChild('on') _onSpan: ElementRef;
    @ViewChild('off') _offSpan: ElementRef;
    @ViewChild('mid') _midSpan: ElementRef;
    @ViewChild('container') _container: ElementRef;
    @ViewChild('main') _main: ElementRef;
    @Input() status = false;

    // public properties
    @Output() statusChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input() onText = 'on';
    @Input() offText = 'off';
    @Input() onColor = 'bootstrap-switch-info';
    @Input() offColor = 'bootstrap-switch-default';
    @Input() size = 'normal';

    private _statusStr = 'false';

    // styles properties
    private _onColor = 'bootstrap-switch-info';
    private _offColor = 'bootstrap-switch-default';
    private _minWidth = 60;
    private _sizeClass = 'bootstrap-switch-normal';

    constructor(private el: ElementRef, private renderer: Renderer) {
        this._calculateSize();
    }

    toggleStatus(): void {
        this.status = !this.status;
        this._statusStr = this.status.toString();
        this.statusChange.emit(this.status);
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        let log: string[] = [];
        // tslint:disable-next-line:forin
        for (let propName in changes) {
            let changedProp = changes[propName];
            let from = changedProp.previousValue;
            let value = changedProp.currentValue;

            switch (propName) {
                case 'onText':
                    this._calculateWidth();
                    break;
                case 'offText':
                    this._calculateWidth();
                    break;
                case 'onColor':
                    this._setColor('on', value);
                    break;
                case 'offColor':
                    this._setColor('off', value);
                    break;
                case 'status':
                    this._statusStr = value.toString();
                    break;
                case 'size':
                    this._calculateSize();
                    break;
            }

            log.push(`${propName} changed from ${from} to ${value}`);
        }
        console.log(log.join(', '));
    }

    ngAfterViewInit() {
        // this._calculateSize('normal');
        // this._calculateWidth();
    }

    private _setColor(switchLabel: string, value: string): void {
        let color = '';
        let defaultColor = 'bootstrap-switch-info';
        if (switchLabel === 'off') {
            defaultColor = 'bootstrap-switch-default';
        }

        switch (value) {
            case 'default':
                color = defaultColor;
                break;
            case 'blue':
                color = 'bootstrap-switch-primary';
                break;
            case 'sky-blue':
                color = 'bootstrap-switch-info';
                break;
            case 'red':
                color = 'bootstrap-switch-danger';
                break;
            case 'yellow':
                color = 'bootstrap-switch-warning';
                break;
            case 'green':
                color = 'bootstrap-switch-success';
                break;
            case 'gray':
                color = 'bootstrap-switch-default';
                break;
        }

        if (switchLabel === 'off') {
            this._offColor = color;
        } else {
            this._onColor = color;
        }
    }

    private _calculateWidth(): void {
        if (this._onSpan) {
            this.renderer.setElementStyle(this._onSpan.nativeElement, 'width', '');
            this.renderer.setElementStyle(this._midSpan.nativeElement, 'width', '');
            this.renderer.setElementStyle(this._offSpan.nativeElement, 'width', '');

            let width = Math.max(this._onSpan.nativeElement.clientWidth, this._offSpan.nativeElement.clientWidth, this._minWidth);

            this.renderer.setElementStyle(this._onSpan.nativeElement, 'width', width.toString() + 'px');
            this.renderer.setElementStyle(this._midSpan.nativeElement, 'width', (width - 10).toString() + 'px');
            this.renderer.setElementStyle(this._offSpan.nativeElement, 'width', width.toString() + 'px');
            this.renderer.setElementStyle(this._container.nativeElement, 'width', (width * 3).toString() + 'px');
            this.renderer.setElementStyle(this._main.nativeElement, 'width', (width * 2).toString() + 'px');
        }
    }

    private _calculateSize(): void {
        switch (this.size) {
            case 'mini':
                this._sizeClass = 'bootstrap-switch-mini';
                this._minWidth = 25;
                break;
            case 'small':
                this._sizeClass = 'bootstrap-switch-small';
                this._minWidth = 30;
                break;
            case 'normal':
                this._sizeClass = 'bootstrap-switch-normal';
                this._minWidth = 60;
                break;
            case 'large':
                this._sizeClass = 'bootstrap-switch-large';
                this._minWidth = 80;
                break;
        }

        this._calculateWidth();
    }
}