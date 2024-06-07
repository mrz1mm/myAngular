import { Component, Inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public route: ActivatedRoute = Inject(ActivatedRoute);
  isLoggedIn$: Observable<boolean>;

  constructor(private authSvc: AuthService) {
    this.isLoggedIn$ = this.authSvc.isLoggedIn$;
  }

  links = [
    { title: 'One', fragment: 'one' },
    { title: 'Two', fragment: 'two' },
  ];

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
}
