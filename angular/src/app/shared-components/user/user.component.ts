import { Component, Input } from '@angular/core';
import { iUsersWithTodos } from '../../interfaces/users-with-todos';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  // Get from the parent component
  @Input() userCard: iUsersWithTodos | null = null;
}
