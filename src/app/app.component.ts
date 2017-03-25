import { Component, OnInit, OnDestroy, ElementRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { ErrorService } from './errors/error.service';
import { ToastyService, ToastyConfig, ToastOptions } from 'ng2-toasty';
import { Subscription } from 'rxjs/Rx';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app',
    styleUrls: ['app.component.scss'],
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy  {
    isauthenticated;
    private subscription: Subscription;

    constructor(elm: ElementRef,
        private route: ActivatedRoute,
        private toastyService: ToastyService,
        private toastyConfig: ToastyConfig,
        private errorService: ErrorService,
        private authService: AuthService) {
        this.toastyConfig.theme = 'bootstrap';

            this.subscription = route.queryParams.subscribe(
                (queryParam: any) => {
                    let token: string;
                    if (queryParam['t']) {
                        token = queryParam['t'];
                        localStorage.setItem('token', queryParam['t']);
                    }else if (localStorage.getItem('token')) {
                        token = localStorage.getItem('token');
                    }
                    if (token) {
                        this.authService.getUserCredentials(token).subscribe(
                            (response) => {
                                window.location.href = '/#/';
                                this.authService.onSignin.emit(response);
                            },
                            (err) => {
                                console.log(err);
                            });
                    }
                }
            );

        // if (elm.nativeElement.getAttribute('isauthenticated') === 'true') {
        //     this.authService.getUserCredentials().subscribe(
        //         (response) => {
        //             this.authService.onSignin.emit(response);
        //         },
        //         (err) => {
        //             console.log(err);
        //         });
        // }
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

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}