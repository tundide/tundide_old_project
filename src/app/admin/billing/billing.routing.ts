import { Routes, RouterModule } from '@angular/router';
import { BillingComponent } from './billing.component';
import { PayComponent } from './pay.component';
import { PaymentMethodsComponent } from './paymentmethods.component';
import { PlansComponent } from './plans.component';
import { SuscriptionsComponent } from './suscriptions.component';
import { PlanComponent } from './plan/plan.component';
import { AuthGuard } from '../../auth/auth-guard.service';

const routes: Routes = [
    {
        canActivate: [AuthGuard],
        children: [
            {
                canActivate: [AuthGuard],
                component: BillingComponent,
                path: 'billing'
            },
            {
                canActivate: [AuthGuard],
                component: PayComponent,
                path: 'pay'
            },
            {
                canActivate: [AuthGuard],
                component: PaymentMethodsComponent,
                path: 'paymentmethods'
            },
            {
                canActivate: [AuthGuard],
                component: PlansComponent,
                path: 'plans'
            },
            {
                canActivate: [AuthGuard],
                component: SuscriptionsComponent,
                path: 'suscriptions'
            },
            {
                canActivate: [AuthGuard],
                component: PlanComponent,
                path: 'plan'
            }
        ],
        component: BillingComponent,
        path: ''
    }
];

export const routing = RouterModule.forChild(routes);

