import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'signin',
  styleUrls: [ 'signin.component.scss' ],
  templateUrl: 'signin.component.html'
})
export class SigninComponent {
  email: string;
  password: string;

  constructor(private authService: AuthService) { }

  onSubmit() {
    this.authService.signin(this.email, this.password).subscribe(
        data => {
                window.location.href = '/';
                console.log(data);
              },
              error => console.error(error)
              );
  }

}