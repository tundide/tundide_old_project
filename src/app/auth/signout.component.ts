import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'signout',
  styleUrls: ['signout.component.scss'],
  templateUrl: 'signout.component.html'
})
export class SignoutComponent implements OnInit {
  private formGroupSignout: FormGroup;

  constructor(private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.formGroupSignout = this.formBuilder.group({
      confirmpassword: this.formBuilder.control('', [Validators.required]),
      email: this.formBuilder.control('', [Validators.required]),
      password: this.formBuilder.control('', [Validators.required])
    });
  }

  submitForm(form: any): void {
    // TODO: Agregar reCaptcha
    this.authService.signout(form.name, form.email, form.password).subscribe(
      data => {
        this.router.navigate(['/auth/confirm']);
      }
    );
  }
}