import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: 'page404', loadChildren: () => import('./pages/page404/page404.module').then(m => m.Page404Module) }, { path: 'page401', loadChildren: () => import('./pages/page401/page401.module').then(m => m.Page401Module) }, { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) }, { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
