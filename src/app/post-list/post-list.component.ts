import { Component, OnInit } from '@angular/core';
import { Post } from 'src/model/post.model';
import { PostService } from '../services/post.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { Category } from 'src/model/category.model';
import { CategoryService } from '../services/category.service';
import { Role } from 'src/model/user.model'; // Assuming Role is imported from user.model

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  providers: [PostListComponent] // Add PostListComponent as a provider

})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  categories: { [key: string]: string } = {};
  searchQuery: string = '';
  userRole$!: Observable<string>;
  showTitle: boolean = false;
  currentUser: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private authService: AuthenticationService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.userRole$ = this.authService.getUserRole();
    this.authService.getUsername().subscribe(username => {
      this.currentUser = username; // Get the current user's username
    });

    // Fetch posts and categories concurrently using forkJoin
    forkJoin({
      posts: this.postService.getPosts(),
      categories: this.categoryService.getAllCategories()
    }).subscribe(({ posts, categories }) => {
      categories.forEach(category => {
        this.categories[category.id] = category.name;
      });

      this.posts = posts.map(post => ({
        ...post,
        categoryName: this.categories[post.categoryId] || 'Uncategorized'
      }));

      // Filter posts based on search query
      this.posts = this.filterPosts();
    });
  }

  deletePost(id: number): void {
    this.postService.getPostById(id).subscribe(post => {
      this.userRole$.subscribe(role => {
        if (post.userId === this.currentUser || role === 'admin') {
          this.postService.deletePost(id).subscribe(
            () => {
              console.log('Post deleted successfully');
              this.posts = this.posts.filter(p => p.id !== id);
              this.router.navigate(['/posts']);
            },
            error => {
              if (error.status === 404) {
                console.error('Post not found. Unable to delete.');
              } else {
                console.error('Error deleting post:', error);
              }
            }
          );
        } else {
          console.error('You are not authorized to delete this post.');
        }
      });
    });
  }
  modifyPost(post: Post): void {
    // Check if the current user is the author of the post

    this.postService.getPostById(post.id).subscribe(
      (retrievedPost: Post) => {
        // Navigate to the edit route with the retrieved post data
        this.router.navigate(['/posts/edit', post.id], { state: { post: retrievedPost } });
      },
      (error) => {
        console.error('Error retrieving post:', error);
        // Optionally, handle the error, e.g., show an error message to the user
      }
    );

  }

  getPosts(): void {
    this.postService.getPosts()
      .subscribe(posts => {
        this.posts = posts;
      });
  }

  createNewPost(): void {
    this.router.navigate(['/posts/create']); // Convert post.id to a string before navigating

  }

  viewPost(id: number): void {
    if (id > 0) {
      this.router.navigate(['/posts', id]); // Redirect to the single post view
    } else {
      console.error('Invalid post ID for viewing');
      // Optionally, you can handle this case by navigating to a default route or showing an error message
    }
  }

  goToReservationForm(): void {
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate(['/reservation']);
      } else {
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/reservation' } });
      }
    });
  }



  filterPosts(): Post[] {
    if (!this.searchQuery) {
      return this.posts; // If search query is empty, return all posts
    } else {
      const searchTerm = this.searchQuery.toLowerCase();
      return this.posts.filter(post =>
        post.categoryName.toLowerCase().includes(searchTerm)
      );
    }
  }
  navigateToReservationForm(postTitle: string): void {
    this.router.navigate(['/reservation-form', postTitle]);
  }
}