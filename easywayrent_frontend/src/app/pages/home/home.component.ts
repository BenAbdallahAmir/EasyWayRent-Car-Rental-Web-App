import { Component } from '@angular/core';
import { TextScrollComponent } from '../../shared/components/text-scroll/text-scroll.component';
import { ParallaxComponent } from '../../shared/components/parallax/parallax.component';
import { CarouseComponent } from '../../shared/components/carousel/carousel.component';

@Component({
  selector: 'app-home',
  imports: [TextScrollComponent,ParallaxComponent,CarouseComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
