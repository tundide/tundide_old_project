import { Routes, RouterModule } from '@angular/router';
import { PriceComponent } from './price.component';
import { AuthGuard } from '../auth/auth-guard.service';

const routes: Routes = [
    {
        canActivate: [AuthGuard],
        component: PriceComponent,
        path: ''
    }
];

export const routing = RouterModule.forChild(routes);

