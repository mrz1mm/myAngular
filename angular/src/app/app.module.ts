import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './main-components/footer/footer.component';
import { HeaderComponent } from './main-components/header/header.component';

import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/guards/auth.guard';
import { Card2Component } from './shared-components/card2/card2.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent, Card2Component],
  imports: [BrowserModule, AppRoutingModule, NgbModule, HttpClientModule],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
