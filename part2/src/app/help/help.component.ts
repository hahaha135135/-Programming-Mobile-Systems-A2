import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help',
  standalone: true,
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
  imports: [CommonModule]
})
export class HelpComponent {
  constructor() { }
}