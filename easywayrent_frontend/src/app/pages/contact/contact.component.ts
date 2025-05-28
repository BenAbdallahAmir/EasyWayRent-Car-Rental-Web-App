import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactHeaderComponent } from "../../shared/layout/headers/contact-header/contact-header.component";

@Component({
  selector: 'app-contact',
  imports: [RouterModule, ContactHeaderComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {}
