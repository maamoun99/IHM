import { Component, OnInit } from '@angular/core';
import { Post } from 'src/model/post.model';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { AuthenticationService } from '../services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/model/category.model'; // Import the Category model
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  imageUrlList: string[] = [];
  newPost: Post = {
    title: '',
    content: '',
    imageUrl: [], // Initialize as an empty array
    price: 0,
    userId: '',
    username: '',
    categoryId: '', // Add categoryId property
    id: this.generateRandomId() // Generate a random ID
    ,
    categoryName: ''
  };
  selectedFile: File | null = null;
  categories: Category[] = []; // Array to store categories

  constructor(
    private router: Router,
    private postService: PostService,
    private authService: AuthenticationService,
    private http: HttpClient, // Inject AuthenticationService
    private categoryService: CategoryService // Inject CategoryService
  ) { }

  ngOnInit(): void {
    // Retrieve the user ID from the authentication service
    this.authService.getUsername().subscribe(username => {
      // Set the user ID in the new post object
      this.newPost.username = username;
    });
    this.authService.getUserID().subscribe(userid => {
      // Set the user ID in the new post object
      this.newPost.userId = userid;
    });
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories; // Assign fetched categories to the component property
    });
  }

  onSubmit(): void {
    if (this.selectedFile) {
      // Perform file upload here if needed
      // Then update the imageUrl field of newPost with the uploaded file URL
    }

    this.postService.createPost(this.newPost)
      .subscribe(() => {
        console.log('Post created successfully');
        this.router.navigate(['/posts']);
      });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  generateRandomId(): number {
    // Generate a random number between 1000 and 9999
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  }

  previewImages(event: any): void {
    this.imageUrlList = [];
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'dalidd');
        this.http.post<any>('https://api.cloudinary.com/v1_1/dexzirjuk/image/upload', formData)
          .subscribe(
            (res) => {
              this.imageUrlList.push(res.secure_url);
              console.log(res.secure_url);
              // Push each URL individually to newPost.imageUrl
              this.newPost.imageUrl.push(res.secure_url);
            },
            (err) => {
              console.error('Erreur lors du téléchargement de l\'image sur Cloudinary : ', err);
            }
          );
      }
    }
  }
}
