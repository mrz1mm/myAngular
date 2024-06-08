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
  private originalFilms: iFilm[] = []; // copia dell'array originale

  private favouriteFilmsSubject = new BehaviorSubject<iFavouriteFilm[]>([]);
  favouriteFilms$ = this.favouriteFilmsSubject.asObservable();
  private favouriteFilms: iFavouriteFilm[] = [];

  filmsUrl: string = `${environment.apiUrl}/films`;
  favouriteFilmsUrl: string = `${environment.apiUrl}/favourite-films`;

  searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  constructor() {
    this.getAllFilms();
    this.getAllFavouriteFilms().subscribe();
  }

  // Metodo per ottenere tutti i film
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
        this.originalFilms = films; // Salva una copia dell'array originale che mi serve per il metodo searchByFilmsName
        this.filmsSubject.next(films);
      });
  }

  // Metodo per ottenere un film in base all'id
  getFilmById(id: number): Observable<iFilm | undefined> {
    return this.films$.pipe(
      map((films) => films.find((film) => film.id === id))
    );
  }

  // Metodo per ottenere tutti i film preferiti
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

  // Metodo per aggiungere un film ai preferiti
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

  // Metodo per rimuovere un film dai preferiti
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

  // Metodo per cercare un film
  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
    this.searchByFilmsName(term);
  }

  // Metodo per cercare un film in base al nome
  searchByFilmsName(searchTerm: string): void {
    if (!searchTerm) {
      // Se il termine di ricerca è vuoto, ripristina l'array originale
      this.filmsSubject.next(this.originalFilms);
      this.films = this.originalFilms;
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const searchedFilms = this.originalFilms.filter((film) =>
        film.title?.toLowerCase().includes(lowerCaseSearchTerm)
      );
      this.filmsSubject.next(searchedFilms);
      this.films = searchedFilms;
    }
  }
}
