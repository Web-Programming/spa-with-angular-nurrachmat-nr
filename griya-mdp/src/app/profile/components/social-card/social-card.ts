import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialLinks } from '../../profile.models';

@Component({
  selector: 'app-social-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-card.html',
  styleUrls: ['./social-card.css']
})
export class SocialCardComponent {
  @Input() links: SocialLinks = {};
}
