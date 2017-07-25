import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as _ from 'lodash';
import * as json from '../../../../config/publication.category.json';

@Component({
  selector: 'home',
  styleUrls: ['home.component.scss'],
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {
  private searchWord: string;
  private selectedType: number;
  private selectedCategory: number;
  private types;
  private categories;
  private formGroupSearch: FormGroup;

  constructor(private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.types = <any>json;

    this.formGroupSearch = this.formBuilder.group({
      category: this.formBuilder.control('', []),
      search: this.formBuilder.control('', [Validators.required]),
      type: this.formBuilder.control('', [])
    });
  }

  onTypeSelected(typeSelected) {
    if (typeSelected) {
      let cat = (<any>_.find(this.types, function (o) {
        return o.id.toString() === typeSelected.toString();
      }));
      this.categories = cat.categories;
    }
  }

  search() {
    let routeOption = {
      b: this.searchWord
    };

    if (this.selectedType) {
      routeOption = _.extend(routeOption, {
        t: this.selectedType
      });
    }

    if (this.selectedCategory) {
      routeOption = _.extend(routeOption, {
        c: this.selectedCategory
      });
    }

    this.router.navigate(['/search', routeOption]);
  }
}