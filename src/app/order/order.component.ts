import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Reservation } from 'src/model/reservation.model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  reservations: Reservation[] = [];
  username: string = '';

  constructor(private orderService: OrderService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.authService.getUsername().subscribe((username) => {
      this.username = username; 
      if (this.username) {
        this.loadReservations();
      }
    });
  }

  loadReservations(): void {
    this.orderService.getReservationsByUsername(this.username).subscribe((reservations) => {
      this.reservations = reservations;
    });
  }

  updateAcceptation(id: string, acceptation: boolean, clientId: string): void {
    this.orderService.updateAcceptation(id, acceptation, clientId).subscribe(
      () => {
        console.log('Reservation updated successfully');
        // Optionally, update component state or display a success message
        // Reload reservations after updating
        this.loadReservations();
      },
      error => {
        console.error('Error updating reservation:', error);
        // Handle error - display an error message to the user
      }
    );
  }
}
