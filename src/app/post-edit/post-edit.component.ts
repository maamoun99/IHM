import { Component, OnInit } from '@angular/core';
import { Post } from 'src/model/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {
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
