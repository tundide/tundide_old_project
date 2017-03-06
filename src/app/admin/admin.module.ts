import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { BillingComponent } from './billing/billing.component';
import { ProfileComponent } from './profile/profile.component';
import { PublicationActiveComponent } from './publication/active.component';
import { PublicationPausedComponent } from './publication/paused.component';
import { AlertComponent } from './settings/alert.component';
import { ScheduleComponent } from './settings/schedule.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { routing } from './admin.routing';
import { SharedModule } from '../shared/shared.module';
import { DataTableModule } from 'angular2-datatable';

@NgModule({
    declarations: [AdminComponent,
        BillingComponent,
        ProfileComponent,
        SidebarComponent,
        AlertComponent,
        ScheduleComponent,
        PublicationActiveComponent,
        PublicationPausedComponent],
    exports: [AdminComponent,
                SidebarComponent,
                PublicationActiveComponent,
                PublicationPausedComponent],
    imports: [routing,
        FormsModule,
        RouterModule,
        CommonModule,
        DataTableModule,
        SharedModule.forRoot()]
})

export class AdminModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AdminModule
        };
    }
}