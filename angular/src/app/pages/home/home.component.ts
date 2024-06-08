import { Component, OnInit, inject } from '@angular/core';
import { FilmService } from '../../services/film.service';
import { iFilm } from '../../interfaces/i-film';
import { UsersService } from '../../services/users.service';
import { iUser } from '../../auth/interfaces/i-user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private filmSvc = inject(FilmService);
  private userSvc = inject(UsersService);
  filmsArray: iFilm[] = [];
  usersArray: iUser[] = [];

  ngOnInit() {
    this.filmSvc.films$.subscribe((films) => {
      if (films) {
        this.filmsArray = films;
      }
    });

    this.userSvc.users$.subscribe((users) => {
      if (users) {
        this.usersArray = users;
      }
    });
  }
}
