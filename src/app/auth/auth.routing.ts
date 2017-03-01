import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin.component';
import { SignoutComponent } from './signout.component';

const routes: Routes = [
    {
        children: [
            { component: SigninComponent, path: 'signin' },
            { component: SignoutComponent, path: 'signout'},
        ],
        path: 'auth'
    }
];

export const routing = RouterModule.forChild(routes);

