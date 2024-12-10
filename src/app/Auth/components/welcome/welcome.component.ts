import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';


@Component({
  selector: 'app-welcome',
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  userName: string = '';
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
  }
}
