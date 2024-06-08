import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FilmService } from '../../services/film.service';
import { iUser } from '../../auth/interfaces/i-user';
import { iFilm } from '../../interfaces/i-film';
import { iFavouriteFilm } from '../../interfaces/i-favourite-film';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private filmSvc = inject(FilmService);
  private authSvc = inject(AuthService);

  user: iUser | null = this.authSvc.getCurrentUser();
  appoggioArray: iFavouriteFilm[] = [];
  favouriteFilmsArray: iFilm[] = [];

  ngOnInit() {
    this.authSvc.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.filmSvc.favouriteFilms$.subscribe((favouriteFilms) => {
          if (favouriteFilms) {
            this.appoggioArray = favouriteFilms;
            this.loadFavouriteFilmsDetails();
          }
        });
      }
    });
  }

  loadFavouriteFilmsDetails() {
    this.filmSvc.films$.subscribe((films) => {
      this.favouriteFilmsArray = films.filter((film) =>
        this.appoggioArray.some(
          (favFilm) =>
            favFilm.filmId === film.id && favFilm.userId === this.user!.id
        )
      );
    });
  }
}
