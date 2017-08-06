import { Component, OnInit, OnDestroy, ElementRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { ErrorService } from './errors/error.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastyService, ToastyConfig, ToastOptions } from 'ng2-toasty';
import { Subscription } from 'rxjs/Rx';
import { User } from './auth/user.model';
import { SocketService } from './shared/socket.service';
declare var $: JQueryStatic;
import * as $S from 'scriptjs';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app',
    styleUrls: ['app.component.scss'],
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
    @ViewChild('contactus') contactusModal: NgbModal;

    private subscription: Subscription;
    private user: User;

    constructor(elm: ElementRef,
        public router: Router,
        public route: ActivatedRoute,
        private modalService: NgbModal,
        private toastyService: ToastyService,
        private toastyConfig: ToastyConfig,
        private errorService: ErrorService,
        private authService: AuthService,
        private socketService: SocketService) {
        this.toastyConfig.theme = 'bootstrap';
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                ga('set', 'page', event.urlAfterRedirects);
                ga('send', 'pageview');
            }
        });

        this.subscription = this.route.queryParams.subscribe(
            (queryParam: any) => {
                let token: string;

                if (queryParam['t']) {
                    token = queryParam['t'];
                    window.location.href = '/#/';
                    localStorage.setItem('token', queryParam['t']);
                } else {
                    token = localStorage.getItem('token');
                }

                if (token) {
                    this.authService.loadUserData(token).subscribe(
                        (user) => {
                            sessionStorage.setItem('user', JSON.stringify(user));
                            this.user = user;
                            this.socketService.connectSocket(user.shortId);
                            this.authService.onUserDataLoad.emit(user);
                        });
                }
            });
    }

    onContactUsClick() {
        this.modalService.open(this.contactusModal, { size: 'lg' }).result.then((result) => {
            if (result) {
                this.toastyService.success({
                    msg: 'El mensaje se envio correctamente',
                    showClose: true,
                    theme: 'bootstrap',
                    timeout: 5000,
                    title: 'Mensaje enviado con exito.'
                });
            }
        });
    }

    ngOnInit() {
        this.errorService.errorOccurred.subscribe((error) => {
            let toastOptions: ToastOptions = {
                msg: error.message,
                showClose: true,
                theme: 'bootstrap',
                timeout: 5000,
                title: 'Ocurrio un error'
            };

            this.toastyService.error(toastOptions);
        });

        if (process.env.ENV === 'development') {
            $S('http://localhost:35729/livereload.js', function () {
                console.log('Debug Habilitado');
            });
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}