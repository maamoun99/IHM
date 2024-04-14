import { Component, OnInit , Output, EventEmitter  } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from 'src/model/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];

  @Output() categoriesLoaded: EventEmitter<Category[]> = new EventEmitter<Category[]>();

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
        this.categoriesLoaded.emit(categories); // Emit the categories array when loaded
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  editCategory(id: number): void {
    // Rediriger vers la page de modification de catégorie avec l'ID de la catégorie spécifique
    // Par exemple, vous pouvez utiliser le routeur pour naviguer vers '/category/edit/:id'
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe(
        () => {
          // Supprimer la catégorie de la liste après la suppression réussie
          this.categories = this.categories.filter(category => category.id !== id);
          console.log('Category deleted successfully');
        },
        (error) => {
          console.error('Error deleting category:', error);
        }
      );
    }
  }
}
