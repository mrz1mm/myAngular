import { Component, Input, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { iUser } from '../../auth/interfaces/i-user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  private authSvc = inject(AuthService);
  @Input() userCard!: iUser;
}
