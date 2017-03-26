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

    constructor(private router: Router,
                private authService: AuthService) { }

    search() {
        this.router.navigate(['/search', { b: this.searchWord }]);
    }

    logout() {
        this.authService.logout().subscribe(() => {
            this.router.navigate(['/']);
            this.authService.onLogout.emit();
        });
    }
    ngOnInit() {
        this.authService.onSignin.subscribe((user) => {
            this.user = user;
        });

        this.authService.onLogout.subscribe(() => {
            this.user = null;
        });
    }


}