import { Routes, RouterModule } from '@angular/router';
import { BillingComponent } from './billing/billing.component';
import { PayComponent } from './billing/pay.component';
import { ProfileComponent } from './profile/profile.component';
import { AlertComponent } from './settings/alert.component';
import { ScheduleComponent } from './settings/schedule.component';
import { AdminComponent } from './admin.component';
import { AuthGuard } from '../auth/auth-guard.service';
import { PublicationActiveComponent } from './publication/active.component';
import { PublicationPausedComponent } from './publication/paused.component';
import { PublicationFavoriteComponent } from './publication/favorite.component';

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
            },
            {
                canActivate: [AuthGuard],
                component: PublicationActiveComponent,
                path: 'active'
            },
            {
                canActivate: [AuthGuard],
                component: PublicationPausedComponent,
                path: 'paused'
            },
            {
                canActivate: [AuthGuard],
                component: PublicationFavoriteComponent,
                path: 'favorite'
            }
        ],
        component: AdminComponent,
        path: 'admin'
    }
];

export const routing = RouterModule.forChild(routes);

