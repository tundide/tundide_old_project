import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CalendarComponent } from './components/calendar/calendar.component';
import { DateTimePickerComponent } from './components/calendar/datetimepicker.component';
import { FileUploadComponent } from './components/fileupload/fileupload.component';
import { FileUploadService } from './components/fileupload/fileupload.service';
import { ValidatorComponent } from './components/validator/validator.component';
import { CalendarModule } from 'angular-calendar';
import { CamelCase } from './camelcase.pipe';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [CamelCase,
        CalendarComponent,
        DateTimePickerComponent,
        FileUploadComponent,
        ValidatorComponent],
    exports: [
        CamelCase,
        CommonModule,
        FormsModule,
        RouterModule,
        CalendarComponent,
        DateTimePickerComponent,
        FileUploadComponent,
        ValidatorComponent],
    imports: [
        CommonModule,
        HttpModule,
        RouterModule,
        FormsModule,
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),
        CalendarModule.forRoot()
    ],
    providers: [FileUploadService]
})

export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule
        };
    }
}