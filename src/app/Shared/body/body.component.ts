import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import HeaderComponent from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
  imports: [RouterOutlet, HeaderComponent, SidebarComponent]
})
export class BodyComponent {
  isLoggedIn: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      // Determina si el usuario está logueado basado en la URL
      this.isLoggedIn = this.router.url !== '/login';
    });
  }
}
