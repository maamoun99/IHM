import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {
    private apiUrl = 'http://localhost:3000/users';

    constructor(private http: HttpClient) { }

    register(user: { username: string, email: string, password: string, role: string, phone: string, status: boolean, id: string }): Observable<any> {
        return this.http.post<any>(this.apiUrl, user);
    }
}
