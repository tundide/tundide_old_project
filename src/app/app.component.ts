import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { ErrorService } from './errors/error.service';
import { ToastyService, ToastyConfig, ToastOptions } from 'ng2-toasty';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app',
    styleUrls: ['app.component.scss'],
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    isauthenticated;

    constructor(elm: ElementRef,
        private toastyService: ToastyService,
        private toastyConfig: ToastyConfig,
        private errorService: ErrorService,
        private authService: AuthService) {
        this.toastyConfig.theme = 'bootstrap';

        if (elm.nativeElement.getAttribute('isauthenticated') === 'true') {
            this.authService.getUserCredentials().subscribe(
                (response) => {
                    this.authService.getSigninEvent().emit(response);
                },
                (err) => {
                    console.log(err);
                });
        }
    }

    ngOnInit() {
        this.errorService.errorOccurred.subscribe((error) => {
            let toastOptions: ToastOptions = {
            msg: error.message,
            showClose: true,
            theme: 'bootstrap',
            timeout: 5000,
            title: error.title
            };

            this.toastyService.error(toastOptions);
        });
    }

}