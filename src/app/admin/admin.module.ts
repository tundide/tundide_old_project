import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { BillingComponent } from './billing/billing.component';
import { ProfileComponent } from './profile/profile.component';
import { AlertComponent } from './settings/alert.component';
import { ScheduleComponent } from './settings/schedule.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { routing } from './admin.routing';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [AdminComponent,
        BillingComponent,
        ProfileComponent,
        SidebarComponent,
        AlertComponent,
        ScheduleComponent],
    exports: [AdminComponent, SidebarComponent],
    imports: [routing,
        FormsModule,
        RouterModule,
        CommonModule,
        SharedModule.forRoot()]
})

export class AdminModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AdminModule
        };
    }
}