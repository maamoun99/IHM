import { Component, OnInit } from '@angular/core';
import { Post } from 'src/model/post.model';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})
export class SinglePostComponent implements OnInit {
  post: Post | undefined;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.getPost();
  }

  getPost(): void {
    // Retrieve the post ID from the route parameters
    const idString = this.route.snapshot.paramMap.get('id');
    if (idString) {
      const id = parseInt(idString, 10);
      // Call the postService to fetch the post by ID
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
}
