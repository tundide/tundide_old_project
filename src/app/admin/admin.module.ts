import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { BillingComponent } from './billing/billing.component';
import { PayComponent } from './billing/pay.component';
import { PaymentMethodsComponent } from './billing/paymentmethods.component';
import { SuscriptionsComponent } from './billing/suscriptions.component';
import { ProfileComponent } from './profile/profile.component';
import { PublicationActiveComponent } from './publication/active.component';
import { PublicationPausedComponent } from './publication/paused.component';
import { PublicationFavoriteComponent } from './publication/favorite.component';
import { AlertComponent } from './settings/alert.component';
import { ScheduleComponent } from './settings/schedule.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { routing } from './admin.routing';
import { SharedModule } from '../shared/shared.module';
import { DataTableModule } from 'angular2-datatable';
import { ReservationService } from '../publication/reservation.service';
import { BillingService } from './billing/billing.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BusyModule } from 'angular2-busy';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

@NgModule({
    declarations: [AdminComponent,
        BillingComponent,
        PayComponent,
        PaymentMethodsComponent,
        SuscriptionsComponent,
        ProfileComponent,
        SidebarComponent,
        AlertComponent,
        ScheduleComponent,
        PublicationActiveComponent,
        PublicationPausedComponent,
        PublicationFavoriteComponent],
    exports: [AdminComponent,
        SidebarComponent,
        PublicationActiveComponent,
        PublicationPausedComponent,
        PublicationFavoriteComponent],
    imports: [routing,
        FormsModule,
        RouterModule,
        CommonModule,
        BrowserAnimationsModule,
        DataTableModule,
        BusyModule,
        SharedModule.forRoot(),
        ConfirmationPopoverModule.forRoot({
            confirmButtonType: 'danger'
        })],
    providers: [ReservationService, BillingService]
})

export class AdminModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AdminModule
        };
    }
}