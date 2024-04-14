import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { RouterModule } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  userRole: string = '';
  showBannedMessage = false; // Define showBannedMessage property

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        this.authService.getUserRole().subscribe(role => {
          this.userRole = role;
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isClient(): boolean {
    return this.userRole === 'client';
  }

  isAdmin(): boolean {
    return this.userRole === 'admin';
  }
}