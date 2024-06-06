import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { iAuthData } from '../interfaces/i-auth-data';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authSvc = inject(AuthService);

  authData: iAuthData = {
    email: '',
    password: '',
  };

  login() {
    this.authSvc.login(this.authData).subscribe((data) => {
      console.log(data);
    });
  }
}
