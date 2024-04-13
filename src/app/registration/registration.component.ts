import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid'; // Import the uuidv4 function
import { Router } from '@angular/router';
import { RegistrationService } from '../services/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  username = '';
  email = '';
  password = '';
  role = 'client';
  phone = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private registrationService: RegistrationService
  ) { }

  register(): void {
    const userId = uuidv4(); // Generate a random UUID for the user
    this.registrationService.register({
      id: userId, // Assign the generated UUID as the user's ID
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role,
      phone: this.phone,
      status: true
    }).subscribe(
      () => {
        // Redirect to login page after successful registration
        this.router.navigate(['/login']);
      },
      error => {
        // Display error message if registration fails
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }
}
