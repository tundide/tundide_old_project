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
    /**
     * Event fired when user authenticated
     * @event      onSignin.
     */
    @Output() onSignin: EventEmitter<any> = new EventEmitter();

    public user;

    constructor(public http: Http) { }

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
                localStorage.setItem('token', result.obj.google.token);
                this.user = new User(result.obj._id, result.obj.google.name, result.obj.google.email, result.obj.google.token);
                return this.user;
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}