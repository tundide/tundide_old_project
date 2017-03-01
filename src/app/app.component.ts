import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app',
    styleUrls: ['app.component.scss'],
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    isauthenticated;

    constructor(elm: ElementRef, private authService: AuthService) {
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
        console.log('forminit');
    }

}