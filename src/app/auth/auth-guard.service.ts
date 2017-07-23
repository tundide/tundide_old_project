import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) { }

    /**
     * Defined if the user is authenticated, if not redirect to login
     * @returns       Boolean to define authentication user
     */
    canActivate() {
        if (!this.auth.loggedIn()) {
            this.router.navigate(['/auth/signin']);
            return false;
        }
        return true;
    }
}