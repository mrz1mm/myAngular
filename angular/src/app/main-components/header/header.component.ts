import { Component, Inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public route: ActivatedRoute = Inject(ActivatedRoute);
  isLoggedIn$: Observable<boolean>;

  constructor(private authSvc: AuthService, private searchSvc: SearchService) {
    this.isLoggedIn$ = this.authSvc.isLoggedIn$;
  }

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

  // Effettua la ricerca dei film
  searchFilms(searchTerm: string) {
    this.searchSvc.setSearchTerm(searchTerm);
  }
}
