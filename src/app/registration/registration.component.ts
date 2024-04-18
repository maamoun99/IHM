import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
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
  gender = ''; // Add gender property
  errorMessage = '';

  constructor(
    private router: Router,
    private registrationService: RegistrationService
  ) { }

  register(): void {
    const userId = uuidv4();
    this.registrationService.register({
      id: userId,
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role,
      phone: this.phone,
      gender: this.gender, // Include gender property
      status: true
    }).subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      error => {
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }
}
