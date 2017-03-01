import { Routes, RouterModule } from '@angular/router';
import { RentComponent } from './rent.component';
import { ViewComponent } from './view.component';
import { AuthGuard } from '../auth/auth-guard.service';
import { PropertyEditComponent } from './property/edit.component';
import { ServiceEditComponent } from './service/edit.component';
import { PropertyViewComponent } from './property/view.component';
import { ServiceViewComponent } from './service/view.component';

const routes: Routes = [
    {
        canActivate: [AuthGuard],
        children: [
            {
                canActivate: [AuthGuard],
                children: [
                    {
                        canActivate: [AuthGuard],
                        component: PropertyEditComponent,
                        path: 'edit'
                    }
                ],
                path: 'property'
            },
            {
                canActivate: [AuthGuard],
                children: [
                    {
                        canActivate: [AuthGuard],
                        component: ServiceEditComponent,
                        path: 'edit'
                    }
                ],
                path: 'service'
            }
        ],
        component: RentComponent,
        path: 'publication'
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                canActivate: [AuthGuard],
                component: PropertyViewComponent,
                path: 'property/:id'
            },
            {
                canActivate: [AuthGuard],
                component: ServiceViewComponent,
                path: 'service/:id'
            }
        ],
        component: ViewComponent,
        path: 'view'
    }
];

export const routing = RouterModule.forChild(routes);

