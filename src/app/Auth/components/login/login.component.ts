import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { StorageService } from '../../Services/StorageService';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule],
  providers: [AuthService],
})
export class LoginComponent {
  //Servicios
  private authService = inject(AuthService);

  public email: string | undefined;
  public password: string | undefined;
  public errorMessage: string | undefined;

  // Constructor con servicio de rutas
  constructor(private router: Router,private storageService: StorageService) {}

  // Lógica para ejecutar al inicializar el componente
  ngOnInit(): void {
    this.clearAuthData();
  }
  // Método para limpiar datos de autenticación
  private clearAuthData(): void {

      // Borrar valores del localStorage
      this.storageService.removeItem('authToken');
      this.storageService.removeItem('username');
      // localStorage.removeItem('authToken');
      // localStorage.removeItem('username');

    // Actualizar el estado de autenticación
    this.authService.logout(); // Esto asegura que el token se elimina y `isLoggedIn` se actualiza.
  }

  // Método de login
  login() {
    // Validación básica antes de llamar al servicio
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingrese su correo y contraseña.';
      //console.log('Campos vacíos:', this.email, this.password);
      return;
    }

    // Llamar al servicio de autenticación
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // Verificar si la respuesta es exitosa
        if (response.isSuccess) {
          // Almacenar el token en el localStorage (o sessionStorage)
          localStorage.setItem('authToken', response.data.token);

          this.authService.setUserName(response.data.name); // Guardar el nombre del usuario
          // Si la autenticación es exitosa, redirigir al usuario
          this.router.navigate(['/welcome']);
        } else {
          // Si el login no es exitoso, mostrar el mensaje de error
          this.errorMessage =
            response.message || 'Error en el inicio de sesión';
        }
      },
      error: (err) => {
        // Manejar errores en el inicio de sesión
        console.error('Error en el login:', err);
        this.errorMessage = 'Usuario o contraseña incorrectos';
      },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
