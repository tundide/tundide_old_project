import { Http, Response, Headers } from '@angular/http';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { User } from './user.model';

/**
 * Manage user authentication and session.
 * @module AuthService
 */
@Injectable()
export class AuthService {
    @Output() onSignin: EventEmitter<any> = new EventEmitter();

    constructor(public http: Http) { }

    /**
     * Event fired when user authenticated
     * @event      onSignin.
     */
    getSigninEvent() {
        return this.onSignin;
    }

    /**
     * Validate is the user is authenticated or not
     * @returns      True or False.
     */
    loggedIn() {
        /**
         * @todo Validar que el token no se haya vencido
         */
        let token = localStorage.getItem('token');

        if (token) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get User Credentials
     * @returns       Objet "User" with UserId - Name - Email - Token.
     */
    getUserCredentials(): Observable<User> {
        const headers = new Headers({ 'Content-Type': 'application/json' });

        return this.http.get('http://localhost:3001/auth/userdata', { headers: headers })
            .map((response: Response) => {
                const result = response.json();
                localStorage.setItem('token', result.user.google.token);
                return new User(result.user._Id, result.user.google.name, result.user.google.email, result.user.google.token);
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}