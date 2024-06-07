import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FilmService } from '../../services/film.service';
import { UsersService } from '../../services/users.service';
import { iUser } from '../../auth/interfaces/i-user';
import { SearchService } from '../../services/search.service';
import { iFilm } from '../../interfaces/i-film';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private filmSvc = inject(FilmService);
  private userSvc = inject(UsersService);
  private searchSvc = inject(SearchService);
  private authSvc = inject(AuthService);

  user: iUser | null = this.authSvc.getCurrentUser();
  favouriteFilmsArray: iFilm[] = [];

  ngOnInit() {
    this.filmSvc.getFavouriteFilmsByCurrentUser().subscribe(
      (favouriteFilms) => {
        console.log(favouriteFilms); // Qui ottieni i dati effettivi dei film preferiti
      },
      (error) => {
        console.error('Error fetching favourite films:', error);
        // Gestire l'errore, ad esempio mostrando un messaggio all'utente
      }
    );

    console.log(this.user);
  }
}
