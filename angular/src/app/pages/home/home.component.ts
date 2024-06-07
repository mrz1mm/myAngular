import { Component, OnInit, inject } from '@angular/core';
import { FilmService } from '../../services/film.service';
import { iFilm } from '../../interfaces/i-film';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private filmSvc = inject(FilmService);
  filmsArray: iFilm[] = [];

  ngOnInit() {
    this.filmSvc.films$.subscribe((films) => {
      if (films) {
        this.filmsArray = films;
        console.log(this.filmsArray);
      }
    });

    this.filmSvc.getAllFilms();
  }
}
