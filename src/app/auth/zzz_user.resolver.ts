// // import { Http, Response, Headers } from '@angular/http';
// import { Injectable } from '@angular/core';
// import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { Observable } from 'rxjs/Rx';
// import { User } from './user.model';
// import { AuthService } from './auth.service';
// import { SocketService } from '../shared/socket.service';

// /**
//  * Resolve.
//  * @module UserService
//  */
// @Injectable()
// export class UserResolver implements Resolve<User> {
//     constructor(private authService: AuthService,
//         private socketService: SocketService) { }

//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
//         let token: string;

//         if (route.queryParams.t) {
//             token = route.queryParams.t;
//             window.location.href = '/#/';
//             localStorage.setItem('token', route.queryParams.t);
//         } else {
//             token = localStorage.getItem('token');
//         }

//         if (token) {
//             this.authService.loadUserData(token).subscribe(
//                 (user) => {
//                     sessionStorage.setItem('user', JSON.stringify(user));
//                     this.socketService.connectSocket(user.shortId);
//                 });
//         }
//     }
// }