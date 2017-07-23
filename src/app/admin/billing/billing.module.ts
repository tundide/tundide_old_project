import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BillingComponent } from './billing.component';
import { PayComponent } from './pay.component';
import { PaymentMethodsComponent } from './paymentmethods.component';
import { PlansComponent } from './plans.component';
import { SuscriptionsComponent } from './suscriptions.component';
import { PlanComponent } from './plan/plan.component';
import { BillingService } from './billing.service';
import { ErrorService } from '../../errors/error.service';
import { SocketService } from '../../shared/socket.service';
import { AuthGuard } from '../../auth/auth-guard.service';
import { BusyModule } from 'angular2-busy';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { routing } from './billing.routing';

@NgModule({
    declarations: [BillingComponent,
        PlanComponent,
        SuscriptionsComponent,
        PayComponent,
        PaymentMethodsComponent,
        PlansComponent],
    imports: [routing,
        FormsModule,
        RouterModule,
        CommonModule,
        BusyModule,
        ConfirmationPopoverModule.forRoot({
            confirmButtonType: 'danger'
        })],
    providers: [AuthGuard,
        BillingService,
        ErrorService,
        SocketService]
})

export class BillingModule { }