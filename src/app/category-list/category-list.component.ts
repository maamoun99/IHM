import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from 'src/model/category.model';
import { MatDialog } from '@angular/material/dialog';
import { CategoryCreateComponent } from '../category-create/category-create.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  styles: [`
  .mat-dialog-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`]
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
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
          // Remove the category from the list after successful deletion
          this.categories = this.categories.filter(category => category.id !== id);
          console.log('Category deleted successfully');
        },
        (error) => {
          console.error('Error deleting category:', error);
        }
      );
    }
  }

  openCreateCategoryPopup(): void {
    const dialogRef = this.dialog.open(CategoryCreateComponent, {
      width: '400px',
      // You can pass data to the dialog if needed
      // data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle dialog close event
      console.log('The dialog was closed');
      // After closing the dialog, fetch the categories again to refresh the list
      this.fetchCategories();
    });
  }
}
