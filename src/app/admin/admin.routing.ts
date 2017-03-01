import { Routes, RouterModule } from '@angular/router';
import { BillingComponent } from './billing/billing.component';
import { ProfileComponent } from './profile/profile.component';
import { AlertComponent } from './settings/alert.component';
import { ScheduleComponent } from './settings/schedule.component';
import { AdminComponent } from './admin.component';
import { AuthGuard } from '../auth/auth-guard.service';

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
                component: ProfileComponent,
                path: 'profile'
            },
            {
                canActivate: [AuthGuard],
                component: AlertComponent,
                path: 'alert'
            },
            {
                canActivate: [AuthGuard],
                component: ScheduleComponent,
                path: 'schedule'
            }
        ],
        component: AdminComponent,
        path: 'admin'
    }
];

export const routing = RouterModule.forChild(routes);

