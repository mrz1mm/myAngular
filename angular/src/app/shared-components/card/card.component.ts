import { Component, Input } from '@angular/core';
import { iFilm } from '../../interfaces/i-film';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() filmsCard!: iFilm;
}
