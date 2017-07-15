import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './main/home/home.component';
import { PriceComponent } from './price/price.component';
import { SearchComponent } from './search/search.component';
// import { UserResolver } from './auth/user.resolver';

export const routes: Routes = [
    {
        component: HomeComponent, path: '', pathMatch: 'full'
        // resolve: {
        //     user: UserResolver
        // }
    },
    { path: 'publication', loadChildren: './publication/publication.module#PublicationModule' },
    { component: SearchComponent, path: 'search' },
    { component: PriceComponent, path: 'price' }
];

export const routing = RouterModule.forRoot(routes, { useHash: true });
