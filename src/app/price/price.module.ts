import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './price.routing';
import { PriceComponent } from './price.component';
import { AuthService } from '../auth/auth.service';
import { ErrorService } from '../errors/error.service';
import { SocketService } from '../shared/socket.service';
import { AuthGuard } from '../auth/auth-guard.service';

@NgModule({
    declarations: [PriceComponent],
    exports: [PriceComponent],
    imports: [routing,
        FormsModule,
        RouterModule,
        CommonModule],
    providers: [AuthService, AuthGuard, ErrorService, SocketService]
})

export class PriceModule { }