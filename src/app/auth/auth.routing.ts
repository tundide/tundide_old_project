import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin.component';
import { SignoutComponent } from './signout.component';
import { ConfirmComponent } from './confirm.component';

const routes: Routes = [
    {
        children: [
            { component: SigninComponent, path: 'signin' },
            { component: SignoutComponent, path: 'signout'},
            { component: ConfirmComponent, path: 'confirm'},
        ],
        path: 'auth'
    }
];

export const routing = RouterModule.forChild(routes);

