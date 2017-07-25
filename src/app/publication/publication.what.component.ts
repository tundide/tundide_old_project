import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as _ from 'lodash';
import * as json from '../../../config/publication.category.json';

@Component({
  selector: 'publication-what',
  styleUrls: ['publication.what.component.scss'],
  templateUrl: 'publication.what.component.html'
})
export class PublicationWhatComponent {
  public whatSelected = {
    category: null,
    subcategory: null,
    type: null
  };
  public publicationTypes = (<any>json);
  public categories;

  @Output()
  public whatChange = new EventEmitter();

  @Input()
  public whatGroup: FormGroup;

  onTypeClick(typeSelected) {
    if (!this.whatSelected.type) {
      this.whatSelected.type = typeSelected;
      let cat = (<any>_.find((<any>json), { type: this.whatSelected.type }));
      this.categories = cat.categories;
    } else {
      this.whatSelected.type = null;
      this.categories = null;
    }
  }

  onCategorySelected() {
    this.whatChange.emit(this.whatSelected);
  }
}