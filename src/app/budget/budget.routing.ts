import { Routes, RouterModule } from '@angular/router';
import { BudgetComponent } from './budget.component';
import { AuthGuard } from '../auth/auth-guard.service';

const routes: Routes = [
    {
        canActivate: [AuthGuard],
        component: BudgetComponent,
        path: 'budget'
    }
];

export const routing = RouterModule.forChild(routes);

