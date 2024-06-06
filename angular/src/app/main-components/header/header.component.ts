import { Component, Inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Inject(AuthService) private authSvc!: AuthService;
  isLoggedIn$: Observable<boolean> = this.authSvc.isLoggedIn$;

  // mostra o nasconde il menu
  toggleNavbar() {
    const navbar = document.getElementById('navbarSupportedContent');
    if (navbar) {
      navbar.classList.toggle('show');
    }
  }

  // effettua il logout
  logout() {
    this.authSvc.logout();
  }

  onSearch($event: any) {}
}
