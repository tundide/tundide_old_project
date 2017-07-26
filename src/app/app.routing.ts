import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './main/home/home.component';
import { AuthGuard } from './auth/auth-guard.service';

export const routes: Routes = [
    {
        component: HomeComponent, path: '', pathMatch: 'full'
    },
    { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
    { path: 'publication', loadChildren: './publication/publication.module#PublicationModule' },
    {
        canActivate: [AuthGuard],
        loadChildren: './admin/admin.module#AdminModule',
        path: 'admin'
    },
    {
        canActivate: [AuthGuard],
        loadChildren: './price/price.module#PriceModule',
        path: 'price'
    },
    { path: 'budget', loadChildren: './budget/budget.module#BudgetModule' },
    {
        loadChildren: './message/message.module#MessageModule',
        path: 'message'
    },
    { path: 'search', loadChildren: './search/search.module#SearchModule' }
];

export const routing = RouterModule.forRoot(routes, { useHash: true });
