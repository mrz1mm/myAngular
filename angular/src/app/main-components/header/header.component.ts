import { Component, Inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { FilmService } from '../../services/film.service';
import { iUser } from '../../auth/interfaces/i-user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public route: ActivatedRoute = Inject(ActivatedRoute);
  isLoggedIn$: Observable<boolean>;

  constructor(
    private authSvc: AuthService,
    private searchSvc: SearchService,
    private filmSvc: FilmService
  ) {
    this.isLoggedIn$ = this.authSvc.isLoggedIn$;
  }

  user: iUser | null = this.authSvc.getCurrentUser();

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

  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSvc.setSearchTerm(searchTerm);
    this.filmSvc.setSearchTerm(searchTerm);
  }

  // Effettua la ricerca dei film
  searchFilms(searchTerm: string) {
    this.searchSvc.setSearchTerm(searchTerm);
  }
}
