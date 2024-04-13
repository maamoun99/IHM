import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  username: string = '';

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.authService.getUsername().subscribe(username => {
      console.log('Received username:', username);
      this.username = username;
    });
  }

}
