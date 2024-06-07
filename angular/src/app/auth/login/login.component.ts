import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { iAuthData } from '../interfaces/i-auth-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authSvc = inject(AuthService);
  private router = inject(Router);

  authData: iAuthData = {
    email: '',
    password: '',
  };

  login() {
    this.authSvc.login(this.authData).subscribe({
      next: (data) => {
        console.log(data);
        if (data.success) {
          this.router.navigate(['/home']);
        }
      },
    });
  }
}
