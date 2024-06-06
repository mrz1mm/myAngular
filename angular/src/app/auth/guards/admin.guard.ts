import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, combineLatest, of, switchMap } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    // combino i due observable in un array per ottenere l'ultimo valore emesso da entrambi
    return combineLatest([
      this.authService.user$,
      this.authService.isLoggedIn$,
    ]).pipe(
      // trasformo l'array di combineLatest in un nuovo observable
      switchMap(([user, isLoggedIn]) => {
        if (isLoggedIn && user?.role === 'admin') {
          return of(true);
        }
        // creo un observable che emette un UrlTree che reindirizza alla pagina di forbidden
        return of(this.router.createUrlTree(['/page401']));
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
