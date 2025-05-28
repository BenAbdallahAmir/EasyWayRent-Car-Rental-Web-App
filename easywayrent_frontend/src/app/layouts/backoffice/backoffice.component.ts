import { Component } from '@angular/core';
import { AdminNavComponent } from "../../shared/layout/navbars/admin-nav/admin-nav.component";
import { RouterModule } from '@angular/router';
import { BacktotopComponent } from "../../shared/components/backtotop/backtotop.component";

@Component({
  selector: 'app-backoffice',
  imports: [AdminNavComponent, RouterModule, BacktotopComponent],
  templateUrl: './backoffice.component.html',
  styleUrl: './backoffice.component.css'
})
export class BackofficeComponent {

}
