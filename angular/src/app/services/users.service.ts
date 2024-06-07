import { Injectable, inject } from '@angular/core';
import { iUser } from '../auth/interfaces/i-user';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { iFilm } from '../interfaces/i-film';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);

  constructor() {
    this.getAllUsers();
  }

  private usersSubject = new BehaviorSubject<iUser[]>([]);
  users$ = this.usersSubject.asObservable();
  private usersArray: iUser[] = [];

  usersUrl: string = `${environment.apiUrl}/users`;

  getAllUsers(): void {
    this.http.get<iUser[]>(this.usersUrl).subscribe((users) => {
      this.usersArray = users;
      this.usersSubject.next(users);
    });
  }
}
