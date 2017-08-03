import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordValidator } from '../shared/customValidators/password.validator';

@Component({
  selector: 'signout',
  styleUrls: ['signout.component.scss'],
  templateUrl: 'signout.component.html'
})
export class SignoutComponent implements OnInit {
  private formGroupSignout: FormGroup;
  private captchaToken;

  constructor(private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    let regexpattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    this.formGroupSignout = this.formBuilder.group({
      confirmpassword: this.formBuilder.control('', [Validators.required,
      Validators.pattern(regexpattern)]),
      email: this.formBuilder.control('', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]),
      password: this.formBuilder.control('', [Validators.required,
      Validators.pattern(regexpattern)])
    }, {
        validator: PasswordValidator.MatchPassword
      });
  }

  handleCorrectCaptcha(event) {
    this.captchaToken = event;
  }

  submitForm(form: any): void {
    this.authService.signout(form.name, form.email, form.password, this.captchaToken).subscribe(
      data => {
        this.router.navigate(['/auth/confirm']);
      }
    );
  }
}