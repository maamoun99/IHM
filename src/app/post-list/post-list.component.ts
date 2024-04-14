import { Component, OnInit } from '@angular/core';
import { Post } from 'src/model/post.model';
import { PostService } from '../services/post.service';
import { Router } from '@angular/router';
import { Observable, switchMap, forkJoin } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { Category } from 'src/model/category.model'; // Import the Category model
import { CategoryService } from '../services/category.service'; // Import the CategoryService

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  categories: { [key: string]: string } = {}; // Map to store category names by ID
  searchQuery: string = '';
  userRole$!: Observable<string>;
  showTitle: boolean = false;
  currentUser: string = '';

  constructor(
    private router: Router,
    private postService: PostService,
    private authService: AuthenticationService,
    private categoryService: CategoryService // Inject CategoryService
  ) { }

  ngOnInit() {
    this.userRole$ = this.authService.getUserRole(); // Subscribe to user's role
    this.authService.getUsername().subscribe(username => {
      this.currentUser = username; // Get the current user's username
    });

    // Fetch posts and categories concurrently using forkJoin
    forkJoin({
      posts: this.postService.getPosts(),
      categories: this.categoryService.getAllCategories()
    }).subscribe(({ posts, categories }) => {
      // Store category names in a map for easy lookup
      categories.forEach(category => {
        this.categories[category.id] = category.name;
      });

      // Assign categories to posts
      this.posts = posts.map(post => ({
        ...post,
        categoryName: this.categories[post.categoryId] || 'Uncategorized' // Assign category name or 'Uncategorized' if not found
      }));
    });

    setTimeout(() => {
      this.showTitle = true;
    }, 500);
  }
  deletePost(id: number): void {
    // Confirm deletion with the user
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(id).subscribe(response => {
        // Remove the deleted post from the list
        this.posts = this.posts.filter(post => post.id !== id);
      });
    }
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