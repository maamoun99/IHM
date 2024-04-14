import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Users } from 'src/model/user.model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  constructor(private authService: AuthenticationService,
    public dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public currentUser: Users
  ) { }

  saveProfile(): void {
    this.authService.updateUser(this.currentUser).subscribe(
      updatedUser => {
        // Optionally, you can handle success, show a message, or navigate to another page
        console.log('Profile updated successfully:', updatedUser);
      },
      error => {
        // Handle error if update fails
        console.error('Error updating profile:', error);
      }
    );
  }
}
