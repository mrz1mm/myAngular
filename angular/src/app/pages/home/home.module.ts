import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CardComponent } from '../../shared-components/card/card.component';

@NgModule({
  declarations: [HomeComponent, CardComponent],
  imports: [CommonModule, HomeRoutingModule],
})
export class HomeModule {}
