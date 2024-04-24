import { Component, OnInit } from '@angular/core';
import { Post } from 'src/model/post.model';
import { PostService } from '../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts: Post[] = [];
  categories: { [key: string]: string } = {};
  searchQuery: string = '';
  locationQuery: string = '';
  showTitle: boolean = false;
  currentUser: string = '';
  currentImageIndex = 0;
  post: Post | null = null;
  userRole$!: Observable<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private authService: AuthenticationService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.userRole$ = this.authService.getUserRole();
    this.route.queryParams.pipe(
      switchMap(params => {
        this.searchQuery = params['searchQuery'] || '';
        this.locationQuery = params['param2'] || '';
        return forkJoin({
          posts: this.postService.getPosts(),
          categories: this.categoryService.getAllCategories()
        });
      })
    ).subscribe(({ posts, categories }) => {
      categories.forEach(category => {
        this.categories[category.id] = category.name;
      });

      this.posts = posts.map(post => ({
        ...post,
        categoryName: this.categories[post.categoryId] || 'Uncategorized'
      }));

      this.posts = this.filterPosts();
    });

    this.authService.getUserRole().pipe(
      switchMap(userRole => this.authService.getUsername().pipe(
        switchMap(username => {
          this.currentUser = username;
          return this.route.queryParams;
        })
      ))
    ).subscribe(params => {
      console.log('User Role:', params['role']);
    });

    setTimeout(() => {
      this.showTitle = true;
    }, 500);
  }

  prevImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.post!.imageUrl.length) % this.post!.imageUrl.length;
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.post!.imageUrl.length;
  }

  deletePost(id: number): void {
    this.postService.getPostById(id).pipe(
      switchMap(post => this.authService.getUserRole().pipe(
        switchMap(role => {
          if (post.userId === this.currentUser || role === 'admin') {
            return this.postService.deletePost(id);
          } else {
            console.error('You are not authorized to delete this post.');
            return [];
          }
        })
      ))
    ).subscribe(
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
  }

  modifyPost(post: Post): void {
    this.postService.getPostById(post.id).subscribe(
      (retrievedPost: Post) => {
        this.router.navigate(['/posts/edit', post.id], { state: { post: retrievedPost } });
      },
      (error) => {
        console.error('Error retrieving post:', error);
      }
    );
  }

  createNewPost(): void {
    this.router.navigate(['/posts/create']);
  }

  viewPost(id: number): void {
    if (id > 0) {
      this.router.navigate(['/posts', id]);
    } else {
      console.error('Invalid post ID for viewing');
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
    var filtred: Post[] = [];
    if (this.searchQuery) {
      filtred = this.posts.filter(post =>
        post.categoryName?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      filtred = this.posts;
    }

    if (this.locationQuery) {
      filtred = filtred.filter(post =>
        post.localisation?.toLowerCase().includes(this.locationQuery.toLowerCase())
      );
    }
    return filtred;
  }
  
  navigateToReservationForm(postTitle: string): void {
    this.router.navigate(['/reservation-form', postTitle]);
  }

  
}