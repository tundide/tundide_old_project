import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ProfileComponent } from './profile/profile.component';
import { PublicationActiveComponent } from './publication/active.component';
import { PublicationPausedComponent } from './publication/paused.component';
import { PublicationFavoriteComponent } from './publication/favorite.component';
import { AlertComponent } from './settings/alert.component';
import { ScheduleComponent } from './settings/schedule.component';
import { routing } from './admin.routing';
import { SharedModule } from '../shared/shared.module';
import { DataTableModule } from 'angular2-datatable';
import { ReservationService } from '../publication/reservation.service';
import { FavoriteService } from '../publication/favorite.service';
import { ErrorService } from '../errors/error.service';
import { SocketService } from '../shared/socket.service';
import { PublicationService } from '../publication/publication.service';
import { AuthGuard } from '../auth/auth-guard.service';
import { BusyModule } from 'angular2-busy';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { AuthService } from '../auth/auth.service';

@NgModule({
    declarations: [AdminComponent,
        ProfileComponent,
        AlertComponent,
        ScheduleComponent,
        PublicationActiveComponent,
        PublicationPausedComponent,
        PublicationFavoriteComponent],
    exports: [AdminComponent,
        PublicationActiveComponent,
        PublicationPausedComponent,
        PublicationFavoriteComponent],
    imports: [routing,
        FormsModule,
        RouterModule,
        CommonModule,
        DataTableModule,
        BusyModule,
        SharedModule.forRoot(),
        ConfirmationPopoverModule.forRoot({
            confirmButtonType: 'danger'
        })],
    providers: [AuthGuard,
        AuthService,
        PublicationService,
        ReservationService,
        FavoriteService,
        ErrorService,
        SocketService]
})

export class AdminModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AdminModule
        };
    }
}