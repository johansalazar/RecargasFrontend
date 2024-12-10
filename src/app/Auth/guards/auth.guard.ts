import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (typeof window !== 'undefined' && this.authService.isAuthenticated()) {
      // Si el usuario está autenticado, permite el acceso
      return true;
    } else {
      // Si no está autenticado, redirige al login
      this.router.navigate(['/']);
      return false;
    }
  }
}
