import { Routes, RouterModule } from '@angular/router';
import { PublicationNewComponent } from './publication.new.component';
import { PublicationViewComponent } from './publication.view.component';
import { PublicationEditComponent } from './publication.edit.component';
import { AuthGuard } from '../auth/auth-guard.service';

const routes: Routes = [
    {
        canActivate: [AuthGuard],
        component: PublicationNewComponent,
        path: ''
    },
    {
        component: PublicationViewComponent,
        path: 'view/:id'
    },
    {
        canActivate: [AuthGuard],
        component: PublicationEditComponent,
        path: 'edit/:id'
    }
];

export const routing = RouterModule.forChild(routes);

