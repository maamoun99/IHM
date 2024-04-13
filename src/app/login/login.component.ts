import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  clientId: string = '';

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) { }


  login(): void {
    this.authService.login({ username: this.username, password: this.password })
      .subscribe(
        (response) => {
          if (response.user) {
            if (response.role === 'client') {
              this.router.navigate(['/reservation']);
            } else if (response.role === 'prestateur') {
              this.router.navigate(['/reservation']);
            }
          } else {
            this.errorMessage = 'Invalid username or password';
          }
        },
        (error) => {
          this.errorMessage = 'Error occurred during login';
        }
      );
  }
}
