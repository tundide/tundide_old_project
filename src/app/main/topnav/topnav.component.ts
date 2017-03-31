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
        this.authService.onSignin.subscribe((user) => {
            this.user = user;

            this.connection = this.socketService.receiveMessages().subscribe(response => {
                // TODO: Agregar esta informacion en el menu de mensajes
                this.messages.push({
                    'message': response.message
                });
            });
        });

        this.authService.onLogout.subscribe(() => {
            this.user = null;
        });
    }

    ngOnDestroy() {
        this.connection.unsubscribe();
    }
}