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
}
