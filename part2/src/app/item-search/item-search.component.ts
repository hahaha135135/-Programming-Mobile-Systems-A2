import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService, InventoryItem } from '../inventory.service';

@Component({
  selector: 'app-item-search',
  standalone: true,
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ItemSearchComponent {
  searchTerm: string = '';
  results: InventoryItem[] = [];
  message: string = '';

  constructor(private inventoryService: InventoryService) {
    this.showAllItems();
  }

  showAllItems(): void {
    this.results = this.inventoryService.getAllItems();
    this.message = `Showing all ${this.results.length} items.`;
  }

  performSearch(): void {
    if (!this.searchTerm.trim()) {
      this.message = 'Please enter a search term.';
      this.showAllItems();
      return;
    }
    
    this.results = this.inventoryService.searchItems(this.searchTerm);
    this.message = `Found ${this.results.length} item(s) matching "${this.searchTerm}".`;
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.showAllItems();
  }

  showPopular(): void {
    this.results = this.inventoryService.getPopularItems();
    this.searchTerm = '';
    this.message = `Showing ${this.results.length} popular item(s).`;
  }
}