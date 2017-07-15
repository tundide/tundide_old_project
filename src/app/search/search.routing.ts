import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search.component';

const routes: Routes = [
    {
        component: SearchComponent,
        path: ''
    }
];

export const routing = RouterModule.forChild(routes);

