import { ClientNavComponent } from './../../shared/layout/navbars/client-nav/client-nav.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MainNavComponent } from '../../shared/layout/navbars/main-nav/main-nav.component';
import { RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user/user.service';
import { BacktotopComponent } from "../../shared/components/backtotop/backtotop.component";
import { FooterComponent } from "../../shared/layout/footer/footer.component";
import { AuthService } from '../../core/auth/service/auth.service';

@Component({
  selector: 'app-frontoffice',
  imports: [MainNavComponent, RouterModule, ClientNavComponent, CommonModule, BacktotopComponent, FooterComponent],
  templateUrl: './frontoffice.component.html',
  styleUrl: './frontoffice.component.css',
})
export class FrontofficeComponent implements OnInit {
  isLoggedIn = false;

  constructor(private userService: UserService,private authService:AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    console.log('isLoggedIn:', this.isLoggedIn);
  }
}
