import { Http, Response, Headers } from '@angular/http';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { User } from './user.model';
import { ErrorService } from '../errors/error.service';
import { SocketService } from '../shared/socket.service';
import {Md5} from 'ts-md5/dist/md5';

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

    /**
     * Event fired when user logout
     * @event      onLogout.
     */
    @Output() onLogout: EventEmitter<any> = new EventEmitter();

    public user;

    private host: string = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

    constructor(public http: Http,
                private errorService: ErrorService,
                private socketService: SocketService,
                ) { }

    /**
     * Validate is the user is authenticated or not
     * @returns      True or False.
     */
    loggedIn() {
        // TODO: Validar que el token no se haya vencido
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
    getUserCredentials(token: string): Observable<User> {
        let headers = new Headers({ 'Authorization': token, 'Content-Type': 'application/json' });

        return this.http.get(this.host + '/auth/userdata', { headers: headers })
            .map((response: Response) => {
                const result = response.json();

                // let token = '';
                // TODO: Agregar los tokens que faltan

                // if (result.obj.google) {
                //     token = result.obj.google.token;
                // }

                // localStorage.setItem('token', 'google ' + token);
                this.socketService.connectSocket(result.obj.shortId);
                this.user = new User(result.obj.name, result.obj.email, result.obj.token);
                return this.user;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    /**
     * Signin with JWT
     * @param  {string} email email of the user
     * @param  {string} password password of the user
     */
    signin(email: string, password: string) {
        let usr = {
            email: email,
            password:  Md5.hashStr(password)
        };

        const body = JSON.stringify(usr);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(this.host + '/auth/signin', body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                localStorage.setItem('token', result.obj.token);
                return result;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    /**
     * Signout with JWT
     * @param  {string} name Name of the user
     * @param  {string} email email of the user
     * @param  {string} password password of the user
     */
    signout(name: string, email: string, password: string) {
        let usr = {
            jwt: {
                email:  email,
                password:  Md5.hashStr(password)
            },
            name: name
        };

        const body = JSON.stringify(usr);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(this.host + '/auth/signout', body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                return result;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    /**
     * Logout User
     */
    logout() {
        localStorage.removeItem('token');
        this.socketService.logout(this.user.shortId);
        this.onLogout.emit();
    }
}