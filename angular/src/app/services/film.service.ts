import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { iFilm } from '../interfaces/i-film';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { iFavouriteFilm } from '../interfaces/i-favourite-film';

@Injectable({
  providedIn: 'root',
})
export class FilmService {
  private http = inject(HttpClient);

  private filmsSubject = new BehaviorSubject<iFilm[]>([]);
  films$ = this.filmsSubject.asObservable();
  private films: iFilm[] = [];

  private favouriteFilmsSubject = new BehaviorSubject<iFavouriteFilm[]>([]);
  favouriteFilms$ = this.favouriteFilmsSubject.asObservable();
  private favouriteFilms: iFavouriteFilm[] = [];

  filmsUrl: string = `${environment.apiUrl}/films`;
  favouriteFilmsUrl: string = `${environment.apiUrl}/favourite-films`;

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

  // metodo per ottenere un film in base all'id
  getFilmById(id: number): Observable<iFilm> {
    return this.http
      .get<iFilm>(`${this.filmsUrl}/${id}`)
      .pipe(
        catchError((error) =>
          throwError(() => new Error('Error fetching film:', error.message))
        )
      );
  }

  // metodo per ottenere tutti i film preferiti
  getAllFavouriteFilms(): Observable<iFavouriteFilm[]> {
    return this.http.get<iFavouriteFilm[]>(this.favouriteFilmsUrl).pipe(
      tap((favouriteFilms) => {
        this.favouriteFilms = favouriteFilms;
        this.favouriteFilmsSubject.next(favouriteFilms);
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
      .post<void>(this.favouriteFilmsUrl, { filmId, userId })
      .pipe(
        tap(() => {
          const newFavouriteFilm: iFavouriteFilm = { filmId, userId };
          this.favouriteFilms.push(newFavouriteFilm); // Aggiungi il film ai preferiti nell'array locale
          this.favouriteFilmsSubject.next([...this.favouriteFilms]); // Aggiorna il BehaviorSubject
        }),
        catchError((error) =>
          throwError(
            () => new Error('Error adding favourite film:', error.message)
          )
        )
      );
  }

  // metodo per rimuovere un film dai preferiti
  removeFavouriteFilm(filmId: number, userId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.favouriteFilmsUrl}/${filmId}/${userId}`)
      .pipe(
        tap(() => {
          this.favouriteFilms = this.favouriteFilms.filter(
            (film) => film.filmId !== filmId || film.userId !== userId
          ); // Rimuovi il film dai preferiti nell'array locale
          this.favouriteFilmsSubject.next([...this.favouriteFilms]); // Aggiorna il BehaviorSubject
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
    this.filmsSubject.next(filteredFilms); // Aggiorna il BehaviorSubject con i film filtrati
    return this.filmsSubject.asObservable(); // Restituisci i film filtrati come Observable
  }
}
