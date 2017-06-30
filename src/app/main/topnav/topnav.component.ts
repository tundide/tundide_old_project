import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { SocketService } from '../../shared/socket.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

declare var $: JQueryStatic;

@Component({
    selector: 'top-nav',
    styleUrls: ['topnav.component.scss'],
    templateUrl: 'topnav.component.html',
})

export class TopNavComponent implements OnInit {
    public searchWord: string;
    public connection;
    public isCollapsed = true;
    public user;
    public messages: Array<any>;
    private formGroupSearch: FormGroup;

    constructor(private router: Router,
        private formBuilder: FormBuilder,
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

        this.formGroupSearch = this.formBuilder.group({
            search: this.formBuilder.control('', [Validators.required])
        });
    }

    ngOnDestroy() {
        this.connection.unsubscribe();
    }
}