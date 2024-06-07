import { HttpClient } from '@angular/common/http';
import { iUser } from './interfaces/i-user';
import { iAuthResponse } from './interfaces/i-auth-response';
import { iAuthData } from './interfaces/i-auth-data';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtHelper: JwtHelperService = new JwtHelperService();

  authSubject = new BehaviorSubject<null | iUser>(null);
  user$ = this.authSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.autoLogin();
  }

  loginUrl: string = `${environment.apiUrl}/login`;
  registerUrl: string = `${environment.apiUrl}/register`;

  // metodo per registrare un nuovo utente
  register(newUser: Partial<iUser>): Observable<iAuthResponse> {
    return this.http.post<iAuthResponse>(this.registerUrl, newUser);
  }

  // metodo per effettuare il login
  login(authData: iAuthData): Observable<iAuthResponse> {
    return this.http.post<iAuthResponse>(this.loginUrl, authData).pipe(
      tap((data) => {
        this.authSubject.next(data.user);
        localStorage.setItem('accessToken', JSON.stringify(data));

        this.autoLogout();
        this.router.navigate(['/home']); // Redirezione dopo il login
      })
    );
  }

  // metodo per effettuare il logout
  logout(): void {
    this.authSubject.next(null);
    localStorage.removeItem('accessToken');
    this.router.navigate(['/auth/login']);
  }

  // metodo per ottenere i dati di accesso dal localStorage
  getAccessData(): iAuthResponse | null {
    const accessDataJson = localStorage.getItem('accessToken');

    if (!accessDataJson) return null;

    const accessData: iAuthResponse = JSON.parse(accessDataJson);
    return accessData;
  }

  // metodo per effettuare il login automatico
  autoLogin(): void {
    const accessData = this.getAccessData();

    if (!accessData) return;
    if (this.jwtHelper.isTokenExpired(accessData.accessToken)) return;

    const user = accessData.user;
    this.authSubject.next(user);
    this.autoLogout();
  }

  // metodo per effettuare il logout automatico
  autoLogout(): void {
    const accessData = this.getAccessData();

    if (!accessData) return;

    const expDate = this.jwtHelper.getTokenExpirationDate(
      accessData.accessToken
    );
    const expMs = expDate?.getTime()! - new Date().getTime();

    setTimeout(() => {
      this.logout();
    }, expMs);
  }

  // metodo per verificare se il token è valido
  isTokenValid(): boolean {
    const accessData = this.getAccessData();
    if (!accessData) return false;
    return !this.jwtHelper.isTokenExpired(accessData.accessToken);
  }

  // getter per ottenere l'observable che emette il valore booleano che indica se l'utente è loggato
  get isLoggedIn$(): Observable<boolean> {
    return this.user$.pipe(map((user) => !!user));
  }

  // ottieni l'utente corrente
  getCurrentUser(): iUser | null {
    return this.authSubject.value;
  }

  // ottieni l'id dell'utente corrente
  getCurrentUserId(): number | null {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser.id : null;
  }

  // ottieni il nome dell'utente corrente
  getCurrentUserName(): string | null {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser.name : null;
  }
}
