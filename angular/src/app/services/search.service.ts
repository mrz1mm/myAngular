import { Injectable, inject } from '@angular/core';
import { FilmService } from './film.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private filmSvc = inject(FilmService);

  private searchTermSubject = new BehaviorSubject<string>('');

  getSearchTerm() {
    return this.searchTermSubject.asObservable();
  }

  setSearchTerm(term: string) {
    this.searchTermSubject.next(term);
    this.filmSvc.setSearchTerm(term);
  }
}
