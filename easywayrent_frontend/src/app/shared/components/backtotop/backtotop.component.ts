import { CommonModule } from '@angular/common';
import { Component, HostListener, NgModule } from '@angular/core';

@Component({
  selector: 'app-backtotop',
  imports: [CommonModule],
  templateUrl: './backtotop.component.html',
  styleUrls: ['./backtotop.component.css'],
})
export class BacktotopComponent {
  isVisible: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.isVisible = scrollPosition > 200; // Show button after scrolling 200px
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
