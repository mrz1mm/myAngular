import { Component, Input } from '@angular/core';
import { iTodosWithUsers } from '../../interfaces/todos-with-users';
import { ToDoListService } from '../../services/to-do-list.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  // Get from the parent component
  @Input() todosCard: iTodosWithUsers | null = null;

  constructor(private todolistService: ToDoListService) {}

  toggleCheckbox(event: Event) {
    if (this.todosCard) this.todosCard.completed = !this.todosCard.completed;
    console.log(this.todosCard?.completed);
    if (this.todosCard) this.todolistService.updateTodo(this.todosCard);
  }
}
