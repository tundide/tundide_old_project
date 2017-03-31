import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
    socket: any;

    private host: string = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

  	/*
  	 * Method to connect the users to socket
  	 */
    connectSocket(userId: string) {
        this.socket = io(this.host, {
            query: `userId=${userId}`
        });
    }

  	/*
  	 * Method to emit the logout event.
  	 */
    logout(userId): any {

        this.socket.emit('logout', userId);

        let observable = new Observable(observer => {
            this.socket.on('logoutResponse', (data) => {
                observer.next(data);
            });

            return () => {

                this.socket.disconnect();
            };
        });
        return observable;
    }

  	/*
  	 * Method to emit the sendMessages event.
  	 */
    sendMessage(message: any): void {
        this.socket.emit('sendMessage', message);
    }

  	/*
  	 * Method to receive sendMessageResponse event.
  	 */
    receiveMessages(): any {
        let observable = new Observable(observer => {
            this.socket.on('sendMessageResponse', (data) => {
                observer.next(data);
            });

            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }
}