import { Component } from '@angular/core';
import { LokasiPerumahan } from '../lokasi-perumahan/lokasi-perumahan';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [LokasiPerumahan, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  numbers: number[] = [1,2,3,4,5]
}
