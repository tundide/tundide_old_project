import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './message.routing';
import { RouterModule } from '@angular/router';
import { MessageComponent } from './message.component';
import { HttpModule } from '@angular/http';
import { SocketService } from '../shared/socket.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [MessageComponent],
    exports: [CommonModule,
        FormsModule,
        RouterModule,
        MessageComponent],
    imports: [
        routing,
        CommonModule,
        HttpModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [SocketService]
})

export class MessageModule {}