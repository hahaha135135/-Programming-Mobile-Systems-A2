import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RouterModule]
})
export class HomeComponent implements OnInit {
  totalItems: number = 0;
  popularItems: number = 0;
  lowStockItems: number = 0;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    const items = this.inventoryService.getAllItems();
    this.totalItems = items.length;
    this.popularItems = items.filter(item => item.popular === 'Yes').length;
    this.lowStockItems = items.filter(item => item.stockStatus === 'Low Stock').length;
  }
}