import { Component, OnInit } from '@angular/core';
import { Post } from 'src/model/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {
  imageUrlList: string[] = [];
  postId: number | undefined;
  post: Post = {
    title: '',
    content: '',
    imageUrl: [],
    price: 0,
    id: 0,
    userId: '',
    categoryId: '',
    categoryName: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient, // Inject AuthenticationService
    private postService: PostService
  ) { }

  ngOnInit(): void {
    const postIdString = this.route.snapshot.paramMap.get('id');
    console.log('Post ID string:', postIdString);
    if (postIdString) {
      this.postId = +postIdString;
      this.fetchPost(this.postId);
    } else {
      this.router.navigate(['/posts']);
    }
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
              this.post.imageUrl.push(res.secure_url);
            },
            (err) => {
              console.error('Erreur lors du téléchargement de l\'image sur Cloudinary : ', err);
            }
          );
      }
    }
  }

  fetchPost(id: number): void {
    this.postService.getPostById(id)
      .subscribe(
        post => {
          if (post) {
            this.post = post;
            // Proceed with editing the post
          } else {
            console.error('Post not found');
            // Optionally, handle the case where the post is not found, e.g., redirect to a default route or show an error message
          }
        },
        error => {
          console.error('Error fetching post:', error);
          // Handle the error, e.g., show an error message to the user
        }
      );
  }

  updatePost(): void {
    if (!this.postId) {
      console.error('Post ID is not defined');
      this.router.navigate(['/posts']);
      return;
    }

    this.postService.updatePost(this.post)
      .subscribe(() => {
        this.router.navigate(['/posts']);
      });
  }
}
