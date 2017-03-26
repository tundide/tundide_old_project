import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'signin',
  styleUrls: [ 'signin.component.scss' ],
  templateUrl: 'signin.component.html'
})
export class SigninComponent {
  constructor(private authService: AuthService) { }

  submitForm(form: any): void {
    this.authService.signin(form.email, form.password).subscribe(
        data => {
                window.location.href = '/';
                console.log(data);
              },
              error => console.error(error)
              );
  }
}