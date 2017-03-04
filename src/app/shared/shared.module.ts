import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TopNavComponent } from './topnav/topnav.component';
import { FooterComponent } from './footer/footer.component';
import { HttpModule } from '@angular/http';
import { CalendarComponent } from './components/calendar/calendar.component';
import { DateTimePickerComponent } from './components/calendar/datetimepicker.component';
import { FileUploadComponent } from './components/fileupload/fileupload.component';
import { CalendarModule } from 'angular-calendar';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [TopNavComponent,
                    FooterComponent,
                    CalendarComponent,
                    DateTimePickerComponent,
                    FileUploadComponent],
    exports: [CommonModule,
        FormsModule,
        RouterModule,
        TopNavComponent,
        FooterComponent,
        CalendarComponent,
        DateTimePickerComponent,
        FileUploadComponent],
    imports: [
        CommonModule,
        HttpModule,
        RouterModule,
        FormsModule,
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),
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