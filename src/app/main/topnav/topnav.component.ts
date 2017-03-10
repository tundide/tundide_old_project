import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
declare var $: JQueryStatic;

@Component({
    selector: 'top-nav',
    styleUrls: ['topnav.component.scss'],
    templateUrl: 'topnav.component.html',
})

export class TopNavComponent implements OnInit {
    searchWord: string;

    isCollapsed = true;
    user;
// TODO: Cambiar el Cerrar Session para que elimie el token de localStorage y redirija
    constructor(private router: Router,
                private authService: AuthService) { }

    Search() {
        this.router.navigate(['/search', { b: this.searchWord }]);
    }

    ngOnInit() {
        this.authService.onSignin.subscribe((user) => {
            this.user = user;
        });
    }


}