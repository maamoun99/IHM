import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms'; // Import NgForm
import { Category } from 'src/model/category.model';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css']
})
export class CategoryCreateComponent {
  @ViewChild('categoryForm') categoryForm!: NgForm; // Add this line

  newCategory: Category = { id: this.generateRandomId(), name: '', sous_categorie: '' };

  constructor(private categoryService: CategoryService) { }

  onSubmit(): void { // Remove the parameter
    if (this.categoryForm.valid) { // Update to use this.categoryForm
      this.categoryService.createCategory(this.newCategory)
        .subscribe(() => {
          console.log('Category created successfully');
          // Reset the form after successful submission
          this.categoryForm.resetForm(); // Update to use this.categoryForm
        });
    }
  }
  generateRandomId(): number {
    // Generate a random number between 1000 and 9999
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  }

}
