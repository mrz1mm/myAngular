import { Component, Input, OnInit, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { iFilm } from '../../interfaces/i-film';
import { FilmService } from '../../services/film.service';

@Component({
  selector: 'app-card2',
  templateUrl: './card2.component.html',
  styleUrl: './card2.component.scss',
})
export class Card2Component implements OnInit {
  private filmSvc = inject(FilmService);
  private authSvc = inject(AuthService);

  @Input() filmsCard!: iFilm;

  isFavourite: boolean = false;
  userId: number | null;

  constructor() {
    this.userId = this.authSvc.getCurrentUserId();
  }

  ngOnInit() {
    this.checkIfFavourite();
  }

  // metodo per controllare se il film è tra i preferiti
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

  // metodo per aggiungere o rimuovere un film dai preferiti
  toggleFavourite(event: Event) {
    event.preventDefault();

    if (this.isFavourite) {
      this.filmSvc
        .removeFavouriteFilm(this.filmsCard.id, this.userId!)
        .subscribe({
          next: () => {
            this.isFavourite = false;
          },
          error: (error) => {
            console.error('Error removing favourite film:', error);
          },
        });
    } else {
      this.filmSvc.addFavouriteFilm(this.filmsCard.id, this.userId!).subscribe({
        next: () => {
          this.isFavourite = true;
        },
        error: (error) => {
          console.error('Error adding favourite film:', error);
        },
      });
    }
  }
}
