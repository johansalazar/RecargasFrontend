import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule,RouterModule]
})

export class SidebarComponent {

 // Definir la propiedad para ocultar o mostrar el sidebar
 isSidebarHidden = false;

 // Método para alternar el estado del sidebar
 toggleSidebar() {
   this.isSidebarHidden = !this.isSidebarHidden;
 }
}
