import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import * as _ from 'lodash';

@Component({
    selector: 'admin',
    styleUrls: ['admin.component.scss'],
    templateUrl: 'admin.component.html'
})

export class AdminComponent implements OnInit {
    private roles: Array<String>;

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.roles = this.authService.getUserCredentials().roles;
    }

    hasRole(role) {
        return _.some(this.roles, function (_role) {
            return _role === role;
        });
    }
}