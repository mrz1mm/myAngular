import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Page401RoutingModule } from './page401-routing.module';
import { Page401Component } from './page401.component';


@NgModule({
  declarations: [
    Page401Component
  ],
  imports: [
    CommonModule,
    Page401RoutingModule
  ]
})
export class Page401Module { }
