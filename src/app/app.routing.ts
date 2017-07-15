import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './main/home/home.component';
// import { UserResolver } from './auth/user.resolver';

export const routes: Routes = [
    {
        component: HomeComponent, path: '', pathMatch: 'full'
        // resolve: {
        //     user: UserResolver
        // }
    },
    { path: 'publication', loadChildren: './publication/publication.module#PublicationModule' },
    { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
    { path: 'price', loadChildren: './price/price.module#PriceModule' },
    { path: 'budget', loadChildren: './budget/budget.module#BudgetModule' },
    { path: 'message', loadChildren: './message/message.module#MessageModule' },
    { path: 'search', loadChildren: './search/search.module#SearchModule' }
];

export const routing = RouterModule.forRoot(routes, { useHash: true });
