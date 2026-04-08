import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService, InventoryItem } from '../inventory.service';

@Component({
  selector: 'app-inventory-management',
  standalone: true,  // 添加这一行
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.css'],
  imports: [CommonModule, FormsModule]  // 添加这一行
})
export class InventoryManagementComponent implements OnInit {
  items: InventoryItem[] = [];
  formData: InventoryItem = {
    id: 0,
    name: '',
    category: 'Electronics',
    quantity: 0,
    price: 0,
    supplier: '',
    stockStatus: 'In Stock',
    popular: 'No',
    comment: ''
  };
  editingItem: boolean = false;
  editingName: string = '';
  message: string = '';
  isError: boolean = false;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.items = this.inventoryService.getAllItems();
  }

  addItem(): void {
    const result = this.inventoryService.addItem({ ...this.formData });
    this.message = result.message;
    this.isError = !result.success;
    
    if (result.success) {
      this.loadItems();
      this.clearForm();
    }
    
    this.clearMessageAfterDelay();
  }

  startEdit(name: string): void {
    const item = this.inventoryService.getItemByName(name);
    if (item) {
      this.formData = { ...item };
      this.editingItem = true;
      this.editingName = name;
    }
  }

  updateItem(): void {
    const result = this.inventoryService.updateItem(this.editingName, { ...this.formData });
    this.message = result.message;
    this.isError = !result.success;
    
    if (result.success) {
      this.loadItems();
      this.clearForm();
    }
    
    this.clearMessageAfterDelay();
  }

  deleteItem(name: string): void {
    if (confirm(`Are you sure you want to delete item "${name}"?`)) {
      const result = this.inventoryService.deleteItemByName(name);
      this.message = result.message;
      this.isError = !result.success;
      this.loadItems();
      this.clearMessageAfterDelay();
    }
  }

  cancelEdit(): void {
    this.clearForm();
  }

  clearForm(): void {
    this.formData = {
      id: 0,
      name: '',
      category: 'Electronics',
      quantity: 0,
      price: 0,
      supplier: '',
      stockStatus: 'In Stock',
      popular: 'No',
      comment: ''
    };
    this.editingItem = false;
    this.editingName = '';
  }

  clearMessageAfterDelay(): void {
    setTimeout(() => {
      this.message = '';
      this.isError = false;
    }, 3000);
  }
}