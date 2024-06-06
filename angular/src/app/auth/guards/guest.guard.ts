import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.isLoggedIn$.pipe(
      // trasformo il valore emesso dall'observable in un nuovo observable
      switchMap((isLoggedIn) => {
        if (!isLoggedIn) return of(this.router.createUrlTree(['/auth/login']));
        return of(true);
      })
    );
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }
}
