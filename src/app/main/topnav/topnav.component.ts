import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { SocketService } from '../../shared/socket.service';

declare var $: JQueryStatic;

@Component({
    selector: 'top-nav',
    styleUrls: ['topnav.component.scss'],
    templateUrl: 'topnav.component.html',
})

export class TopNavComponent implements OnInit {
    searchWord: string;
    connection;
    isCollapsed = true;
    user;
    public messages: Array<any>;

    constructor(private router: Router,
                private authService: AuthService,
                private socketService: SocketService) {
                    this.messages = new Array();
                }

    search() {
        this.router.navigate(['/search', { b: this.searchWord }]);
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }

    ngOnInit() {
        this.user = this.authService.getUserCredentials();

        this.authService.onUserDataLoad.subscribe((user) => {
            this.user = user;
        });

        this.authService.onLogout.subscribe(() => {
            this.user = null;
        });
    }

    ngOnDestroy() {
        this.connection.unsubscribe();
    }
}