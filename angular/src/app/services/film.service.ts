import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { iFilm } from '../interfaces/i-film';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../environments/environment';
import { iFavouriteFilm } from '../interfaces/i-favourite-film';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FilmService {
  private http = inject(HttpClient);
  private authSvc = inject(AuthService);

  private filmsSubject = new BehaviorSubject<iFilm[]>([]);
  films$ = this.filmsSubject.asObservable();
  private films: iFilm[] = [];

  private favouriteFilmsSubject = new BehaviorSubject<iFavouriteFilm[]>([]);
  favouriteFilms$ = this.favouriteFilmsSubject.asObservable();
  private favouriteFilms: iFavouriteFilm[] = [];

  filmsUrl: string = `${environment.apiUrl}/films`;
  favouriteFilmsUrl: string = `${environment.apiUrl}/favourite-films`;

  constructor() {
    this.getAllFilms();
    this.getAllFavouriteFilms().subscribe();
  }

  // metodo per ottenere tutti i film
  getAllFilms(): void {
    this.http
      .get<iFilm[]>(this.filmsUrl)
      .pipe(
        catchError((error) =>
          throwError(() => new Error('Error fetching films:', error.message))
        )
      )
      .subscribe((films) => {
        this.films = films;
        this.filmsSubject.next(films);
      });
  }

  // Metodo per ottenere un film in base all'id
  getFilmById(id: number): Observable<iFilm | undefined> {
    return this.films$.pipe(
      map((films) => films.find((film) => film.id === id))
    );
  }

  // metodo per ottenere tutti i film preferiti
  getAllFavouriteFilms(): Observable<iFavouriteFilm[]> {
    return this.http.get<iFavouriteFilm[]>(this.favouriteFilmsUrl).pipe(
      tap((favouriteFilms) => {
        this.favouriteFilms = favouriteFilms;
        this.favouriteFilmsSubject.next(favouriteFilms);
        console.log('service');
      }),
      catchError((error) =>
        throwError(
          () => new Error('Error fetching favourite films:', error.message)
        )
      )
    );
  }

  // metodo per aggiungere un film ai preferiti
  addFavouriteFilm(filmId: number, userId: number): Observable<void> {
    return this.http
      .post<iFavouriteFilm>(this.favouriteFilmsUrl, { filmId, userId })
      .pipe(
        tap((newFavouriteFilm) => {
          this.favouriteFilms.push(newFavouriteFilm); // Aggiungi il film ai preferiti nell'array locale
          this.favouriteFilmsSubject.next([...this.favouriteFilms]); // Aggiorna il BehaviorSubject
        }),
        map(() => {}), // Trasforma il risultato in void
        catchError((error) =>
          throwError(
            () => new Error('Error adding favourite film:', error.message)
          )
        )
      );
  }

  // metodo per rimuovere un film dai preferiti
  removeFavouriteFilm(filmId: number, userId: number): Observable<void> {
    // Cerca il film nei preferiti
    return this.http
      .get<iFavouriteFilm[]>(
        `${this.favouriteFilmsUrl}?filmId=${filmId}&userId=${userId}`
      )
      .pipe(
        // Se il film è tra i preferiti, rimuovilo
        switchMap((favouriteFilms) => {
          const favouriteFilm = favouriteFilms[0];
          if (favouriteFilm) {
            return this.http
              .delete<void>(`${this.favouriteFilmsUrl}/${favouriteFilm.id}`)
              .pipe(
                tap(() => {
                  this.favouriteFilms = this.favouriteFilms.filter(
                    (film) => film.filmId !== filmId || film.userId !== userId
                  );
                  this.favouriteFilmsSubject.next([...this.favouriteFilms]);
                })
              );
          } else {
            return throwError(() => new Error('Favourite film not found'));
          }
        }),
        catchError((error) =>
          throwError(
            () => new Error('Error removing favourite film:', error.message)
          )
        )
      );
  }

  // metodo per cercare un film
  searchFilms(searchTerm: string): Observable<iFilm[]> {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredFilms = this.films.filter((film) =>
      film.title?.toLowerCase().includes(lowerCaseSearchTerm)
    );
    this.filmsSubject.next(filteredFilms);
    return this.filmsSubject.asObservable();
  }

  // Metodo per ottenere solo i film preferiti dell'utente attualmente loggato
  getFavouriteFilmsByCurrentUser(): Observable<iFilm[]> {
    return this.authSvc.user$.pipe(
      map((user) => {
        const favouriteFilms = this.favouriteFilms.filter(
          (film) => film.userId === user!.id
        );
        console.log(user!.id);
        const favouriteFilmIds = favouriteFilms.map((film) => film.filmId);
        const favouriteFilmsData = this.films.filter((film) =>
          favouriteFilmIds.includes(film.id)
        );
        this.filmsSubject.next(favouriteFilmsData);
        console.log(favouriteFilmsData);
        return favouriteFilmsData;
      })
    );
  }
}
