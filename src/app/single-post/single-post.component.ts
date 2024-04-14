import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Post } from 'src/model/post.model';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../services/post.service';
import {Swiper} from 'swiper';
import { Observable} from 'rxjs';


@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})
export class SinglePostComponent implements OnInit {
  post: Post | undefined;
  userRole$!: Observable<string>;


  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    const mySwiper = new Swiper('.swiper-container', {
      // Optional parameters
      loop: true,

      // If you need pagination
      pagination: {
        el: '.swiper-pagination',
      },
    });
    this.userRole$ = this.authService.getUserRole();
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
