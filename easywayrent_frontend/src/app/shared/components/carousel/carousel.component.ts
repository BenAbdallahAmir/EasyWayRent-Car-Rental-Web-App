import { RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import {
  CarouselCaptionComponent,
  CarouselComponent,
  CarouselControlComponent,
  CarouselInnerComponent,
  CarouselItemComponent,
  ThemeDirective,
} from '@coreui/angular';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  standalone: true,
  imports: [
    ThemeDirective,
    CarouselComponent,
    CarouselInnerComponent,
    NgFor,
    CarouselItemComponent,
    CarouselControlComponent,
    RouterModule,
    CarouselCaptionComponent,
  ],
})
export class CarouseComponent implements OnInit {
  slides: any[] = new Array(3).fill({
    id: -1,
    src: '',
    title: '',
  });
  @Input() pauseOnHover: boolean = false;
  ngOnInit(): void {
    this.slides[2] = {
      id: 2,
      src: 'assets/carousel-img/Mercedes.jpg',
      title: 'Sedans',
    };
    this.slides[1] = {
      id: 1,
      src: 'assets/carousel-img/ford.jpg',
      title: 'Pickup Trucks',
    };
    this.slides[0] = {
      id: 0,
      src: 'assets/carousel-img/range.jpg',
      title: 'SUVs',
    };
    this.slides[3] = {
      id: 3,
      src: 'assets/carousel-img/nissan.jpg',
      title: 'City Cars',
    };
    this.slides[4] = {
      id: 4,
      src: 'assets/carousel-img/golf.jpg',
      title: 'Compact Cars',
    };
    this.slides[5] = {
      id: 5,
      src: 'assets/carousel-img/jeep.jpg',
      title: 'Off-Road',
    };
    this.slides[6] = {
      id: 6,
      src: 'assets/carousel-img/lambo.jpg',
      title: 'Supercars',
    };
  }
}
