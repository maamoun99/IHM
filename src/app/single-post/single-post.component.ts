import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Post } from 'src/model/post.model';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../services/post.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})
export class SinglePostComponent implements OnInit {
  post: Post | undefined;
  userRole$!: Observable<string>;
  currentImageIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.userRole$ = this.authService.getUserRole();
    this.getPost();
  }

  getPost(): void {
    const idString = this.route.snapshot.paramMap.get('id');
    if (idString) {
      const id = parseInt(idString, 10);
      this.postService.getPostById(id).subscribe(
        post => {
          this.post = post;
        },
        error => {
          console.error('Error fetching post:', error);
        }
      );
    }
  }

  nextImage(): void {
    if (this.post) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.post.imageUrl.length;
    }
  }

  prevImage(): void {
    if (this.post) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.post.imageUrl.length) % this.post.imageUrl.length;
    }
  }
}
