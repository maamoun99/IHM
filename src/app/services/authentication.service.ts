import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Users } from 'src/model/user.model';

@Injectable({
  providedIn: 'root'
  
})
export class AuthenticationService {
  private apiUrl = 'http://localhost:3000/users';
  private isAuthenticatedSource = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSource.asObservable();
  private roleSource = new BehaviorSubject<string>('');
  role$ = this.roleSource.asObservable();
  private usernameSource = new BehaviorSubject<string>('');
  username$ = this.usernameSource.asObservable();
  private idSource = new BehaviorSubject<string>('');
  id$ = this.idSource.asObservable(); // Corrected to use idSource

  constructor(private http: HttpClient) { }

  login(credentials: { username: string, password: string }): Observable<{ user: any, role: string }> {
    return this.http.get<any>(`${this.apiUrl}?username=${credentials.username}&password=${credentials.password}`)
      .pipe(
        map(response => {
          if (response.length > 0) {
            const user = response[0];
            this.isAuthenticatedSource.next(true);
            this.roleSource.next(user.role);
            this.usernameSource.next(user.username);
            this.idSource.next(user.id); // Update the user ID
            return { user, role: user.role };
          } else {
            this.isAuthenticatedSource.next(false);
            this.roleSource.next('');
            this.usernameSource.next('');
            this.idSource.next(''); // Clear the user ID
            return { user: null, role: '' };
          }
        })
      );
  }

  logout(): void {
    this.isAuthenticatedSource.next(false);
    this.roleSource.next('');
    this.usernameSource.next('');
    this.idSource.next('');
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  getUserRole(): Observable<string> {
    return this.role$;
  }

  getUsername(): Observable<string> {
    return this.username$;
  }

  getUserID(): Observable<string> {
    return this.id$;
  }
  getPhoneNumber(): Observable<string> {
    return this.getUser().pipe(
      map(user => user.phone)
    );
  }
  
  private getUser(): Observable<Users> {
    return this.http.get<Users>(`${this.apiUrl}/current`).pipe(
      tap(user => {
        this.isAuthenticatedSource.next(true);
        this.roleSource.next(user.role);
        this.usernameSource.next(user.username);
        this.idSource.next(user.id);
      }),
      catchError(error => {
        this.isAuthenticatedSource.next(false);
        this.roleSource.next('');
        this.usernameSource.next('');
        this.idSource.next('');
        return throwError(error);
      })
    );
  }
}
