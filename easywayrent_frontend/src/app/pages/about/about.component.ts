import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AboutHeaderComponent } from "../../shared/layout/headers/about-header/about-header.component";

@Component({
  selector: 'app-about',
  imports: [RouterModule, AboutHeaderComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {}
