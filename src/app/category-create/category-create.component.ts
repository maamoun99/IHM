import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Category } from 'src/model/category.model';
import { CategoryService } from '../services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css']
})
export class CategoryCreateComponent {
  @ViewChild('categoryForm') categoryForm!: NgForm;

  newCategory: Category = { id: this.generateRandomId(), name: '', sous_categorie: [] };
  categories: Category[] = []; // Array to store existing categories

  constructor(private categoryService: CategoryService, private router: Router) {
    this.fetchCategories(); // Fetch categories when component is initialized
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryName = this.newCategory.name;
      const sous_categorie = this.newCategory.sous_categorie[0];
  
      // Check if the category name already exists
      if (this.categories.some(category => category.name === categoryName )) {
        // Display error message to the user
        alert('Category with this name and sous_categorie already exists. Please choose a different name and sous_categorie.');
        return;
      }
      // Continue with form submission if category name is unique
      this.categoryService.createCategory(this.newCategory)
        .subscribe(() => {
          console.log('Category created successfully');
          // Reset the form after successful submission
          this.categoryForm.resetForm();
          // Redirect to category list page
          this.router.navigate(['/category']);
        });
    }
  }
  

  generateRandomId(): number {
    // Generate a random number between 1000 and 9999
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
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
}
