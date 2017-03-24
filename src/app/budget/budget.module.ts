import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './budget.routing';
import { AuthGuard } from '../auth/auth-guard.service';
import { BudgetComponent } from './budget.component';
import { ToastyModule } from 'ng2-toasty';
import { WizardModule } from 'ng2-archwizard/dist';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [BudgetComponent],
    exports: [BudgetComponent],
    imports: [routing,
        WizardModule,
        FormsModule,
        RouterModule,
        CommonModule,
        NgbModule,
        ToastyModule.forRoot()],
    providers: [AuthGuard]
})

export class BudgetModule { }