import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TopNavComponent } from './topnav/topnav.component';
import { FooterComponent } from './footer/footer.component';
import { HttpModule } from '@angular/http';
import { CalendarComponent } from '../shared/components/calendar/calendar.component';
import { CalendarModule } from 'angular-calendar';

@NgModule({
    declarations: [TopNavComponent, FooterComponent, CalendarComponent],
    exports: [CommonModule,
        FormsModule,
        RouterModule,
        TopNavComponent,
        FooterComponent,
        CalendarComponent],
    imports: [
        CommonModule,
        HttpModule,
        RouterModule,
        FormsModule,
        CalendarModule.forRoot()
    ]
})

export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule
        };
    }
}