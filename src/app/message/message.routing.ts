import { Routes, RouterModule } from '@angular/router';
import { MessageComponent } from './message.component';
import { AuthGuard } from '../auth/auth-guard.service';

const routes: Routes = [
    {
        canActivate: [AuthGuard],
        component: MessageComponent,
        path: ''
    }
];

export const routing = RouterModule.forChild(routes);

