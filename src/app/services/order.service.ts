import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from 'src/model/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/reservations';

  constructor(private http: HttpClient) { }

  getReservationsByUsername(username: string): Observable<Reservation[]> {
    const url = `${this.apiUrl}?username=${username}`;
    return this.http.get<Reservation[]>(url);
  }

  addOrder(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  updateAcceptation(id: string, acceptation: boolean, clientId: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    const updatedReservation = { acceptation: acceptation, clientId: clientId };
    return this.http.put<any>(url, updatedReservation);
  }
}
