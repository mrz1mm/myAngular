import { Component, Input, OnInit, inject } from '@angular/core';
import { iFilm } from '../../interfaces/i-film';
import { FilmService } from '../../services/film.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent implements OnInit {
  private filmSvc = inject(FilmService);
  private authSvc = inject(AuthService);

  @Input() filmsCard!: iFilm;

  isFavourite: boolean = false;
  userId: number | null;

  constructor() {
    this.userId = this.authSvc.getCurrentUser()?.id ?? null;
  }

  ngOnInit() {
    this.checkIfFavourite();
  }

  checkIfFavourite() {
    if (this.userId !== null) {
      this.filmSvc.getAllFavouriteFilms().subscribe((favouriteFilms) => {
        this.isFavourite = favouriteFilms.some(
          (film) =>
            film.filmId === this.filmsCard.id && film.userId === this.userId
        );
      });
    }
  }

  toggleFavourite(event: Event) {
    event.preventDefault();
    if (this.userId === null) {
      console.error('User is not logged in.');
      return;
    }
    if (this.isFavourite) {
      this.filmSvc
        .removeFavouriteFilm(this.filmsCard.id, this.userId)
        .subscribe(
          () => {
            this.isFavourite = false;
          },
          (error) => {
            console.error('Error removing favourite film:', error);
          }
        );
    } else {
      this.filmSvc.addFavouriteFilm(this.filmsCard.id, this.userId).subscribe(
        () => {
          this.isFavourite = true;
        },
        (error) => {
          console.error('Error adding favourite film:', error);
        }
      );
    }
  }
}
