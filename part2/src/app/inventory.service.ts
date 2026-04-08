import { Injectable } from '@angular/core';

export interface InventoryItem {
  id: number;
  name: string;
  category: 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous';
  quantity: number;
  price: number;
  supplier: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  popular: 'Yes' | 'No';
  comment?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private inventory: InventoryItem[] = [
    {
      id: 1,
      name: "MacBook Pro",
      category: "Electronics",
      quantity: 15,
      price: 1999.99,
      supplier: "Apple Inc.",
      stockStatus: "In Stock",
      popular: "Yes",
      comment: "Best seller"
    },
    {
      id: 2,
      name: "Office Desk",
      category: "Furniture",
      quantity: 3,
      price: 299.99,
      supplier: "IKEA",
      stockStatus: "Low Stock",
      popular: "No",
      comment: ""
    },
    {
      id: 3,
      name: "Wireless Mouse",
      category: "Electronics",
      quantity: 50,
      price: 29.99,
      supplier: "Logitech",
      stockStatus: "In Stock",
      popular: "Yes",
      comment: "Customer favorite"
    },
    {
      id: 4,
      name: "Gaming Chair",
      category: "Furniture",
      quantity: 0,
      price: 399.99,
      supplier: "Secretlab",
      stockStatus: "Out of Stock",
      popular: "Yes",
      comment: "High demand"
    }
  ];

  constructor() { }

  // Get all items
  getAllItems(): InventoryItem[] {
    return [...this.inventory];
  }

  // Get item by name
  getItemByName(name: string): InventoryItem | undefined {
    return this.inventory.find(item => item.name === name);
  }

  // Add new item
  addItem(item: InventoryItem): { success: boolean; message: string } {
    // Check for duplicate ID
    if (this.inventory.some(i => i.id === item.id)) {
      return { success: false, message: `Item ID ${item.id} already exists.` };
    }
    
    // Check for duplicate name
    if (this.inventory.some(i => i.name.toLowerCase() === item.name.toLowerCase())) {
      return { success: false, message: `Item name "${item.name}" already exists.` };
    }
    
    this.inventory.push(item);
    return { success: true, message: `Item "${item.name}" added successfully.` };
  }

  // Update item by name
  updateItem(name: string, updatedItem: InventoryItem): { success: boolean; message: string } {
    const index = this.inventory.findIndex(i => i.name === name);
    if (index === -1) {
      return { success: false, message: `Item "${name}" not found.` };
    }
    
    // Check ID uniqueness if changed
    if (updatedItem.id !== this.inventory[index].id) {
      if (this.inventory.some(i => i.id === updatedItem.id)) {
        return { success: false, message: `Item ID ${updatedItem.id} already exists on another item.` };
      }
    }
    
    this.inventory[index] = { ...updatedItem };
    return { success: true, message: `Item "${name}" updated successfully.` };
  }

  // Delete item by name
  deleteItemByName(name: string): { success: boolean; message: string } {
    const index = this.inventory.findIndex(i => i.name === name);
    if (index === -1) {
      return { success: false, message: `Item "${name}" not found.` };
    }
    
    this.inventory.splice(index, 1);
    return { success: true, message: `Item "${name}" deleted successfully.` };
  }

  // Search items by name
  searchItems(searchTerm: string): InventoryItem[] {
    if (!searchTerm.trim()) {
      return [...this.inventory];
    }
    return this.inventory.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Get popular items
  getPopularItems(): InventoryItem[] {
    return this.inventory.filter(item => item.popular === 'Yes');
  }
}