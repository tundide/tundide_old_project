import { Component, OnInit, OnDestroy, ElementRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { ErrorService } from './errors/error.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastyService, ToastyConfig, ToastOptions } from 'ng2-toasty';
import { Subscription } from 'rxjs/Rx';
import { User } from './auth/user.model';
import { SocketService } from './shared/socket.service';

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
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private toastyService: ToastyService,
        private toastyConfig: ToastyConfig,
        private errorService: ErrorService,
        private authService: AuthService,
        private socketService: SocketService) {
        this.toastyConfig.theme = 'bootstrap';
        // this.subscription = route.queryParams.subscribe(
        //     (queryParam: any) => {
        //         if (queryParam['t']) {
        //             window.location.href = '/#/';
        //         }
        //     }
        // );
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
        let token: string;
        this.subscription = this.route.queryParams.subscribe(
            (queryParam: any) => {
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
            this.loadScript('http://localhost:35729/livereload.js');
        }
    }

    public loadScript(url) {
        let node = document.createElement('script');
        node.src = url;
        node.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(node);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}