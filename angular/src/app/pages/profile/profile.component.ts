import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FilmService } from '../../services/film.service';
import { UsersService } from '../../services/users.service';
import { iUser } from '../../auth/interfaces/i-user';
import { SearchService } from '../../services/search.service';
import { iFilm } from '../../interfaces/i-film';
import { iFavouriteFilm } from '../../interfaces/i-favourite-film';

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
  appoggioArray: iFavouriteFilm[] = [];
  favouriteFilmsArray: iFilm[] = [];

  ngOnInit() {
    this.authSvc.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.filmSvc.favouriteFilms$.subscribe((favouriteFilms) => {
          if (favouriteFilms) {
            this.appoggioArray = favouriteFilms;
            console.log('Favorite Films:', this.appoggioArray);
          }
        });
      }
    });
  }

  loadFavouriteFilms() {
    this.filmSvc
      .getFavouriteFilmsByCurrentUser()
      .subscribe((favouriteFilms) => {
        this.favouriteFilmsArray = favouriteFilms;
        console.log('Favorite Filmsss:', this.favouriteFilmsArray);
      });
  }
}
