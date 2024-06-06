import { Component } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { ToDoListService } from '../../services/to-do-list.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(
    private searchService: SearchService,
    private todolistService: ToDoListService,
    private authService: AuthService
  ) {}

  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchService.setSearchTerm(searchTerm);
    this.todolistService.setSearchTerm(searchTerm);
  }

  toggleNavbar() {
    const navbar = document.getElementById('navbarSupportedContent');
    if (navbar) {
      navbar.classList.toggle('show');
    }
  }

  logout() {
    this.authService.logout();
  }
}
