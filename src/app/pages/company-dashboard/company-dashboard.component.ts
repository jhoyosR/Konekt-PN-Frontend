import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component'; 
@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './company-dashboard.component.html',
  styleUrl: './company-dashboard.component.css'
})
export class CompanyDashboardComponent {

}
