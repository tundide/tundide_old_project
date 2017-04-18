import { Component  } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'signout',
  styleUrls: [ 'signout.component.scss' ],
  templateUrl: 'signout.component.html'
})
export class SignoutComponent {
  constructor(private authService: AuthService,
              private router: Router) { }

  submitForm(form: any): void {
    // TODO: Validar los datos de formulario
    // TODO: Agregar reCaptcha
    this.authService.signout(form.name, form.email, form.password).subscribe(
        data => {
                this.router.navigate(['/auth/confirm']);
              }
    );
  }
}