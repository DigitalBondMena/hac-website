import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { UserRole } from '@core/services/user/user.service';
import { TranslateModule } from '@ngx-translate/core';
import { ArticlesHeaderComponent } from '../../articles/components/articles-header/articles-header.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ArticlesHeaderComponent,
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  // Make UserRole enum available to template
  UserRole = UserRole;

  // User role for registration
  userRole: UserRole = UserRole.CUSTOMER;

  ngOnInit(): void {
    // Get the role parameter from the route if present
    this._route.params.subscribe((params) => {
      const roleParam = params['role'];

      // if (roleParam !== undefined) {
      //   this.userRole = Number(roleParam);
      //   console.log(
      //     `Registering as: ${
      //       this.userRole === UserRole.BUSINESS ? 'Business' : 'Customer'
      //     }`
      //   );
      // } else {
      //   console.log('Registering as: Customer (default)');
      // }
      this.userRole = UserRole.CUSTOMER;
    });

    // Check if we're at the root register path, then redirect to personal
    if (this._router.url.endsWith('/register')) {
      this._router.navigate(['register/personal']);
    }
  }

  /**
   * Checks if a user ID is present in the system
   * Used to determine if the user is already registered
   * @returns True if a user ID exists
   */
  hasUserId(): boolean {
    // This is a placeholder - in a real app, you'd check if the user is logged in
    // and has a valid ID from the auth service
    const hasId = false; // Replace with actual implementation
    console.log(`User ID exists: ${hasId}`);
    return hasId;
  }

  /**
   * Checks if the given route segment is active
   * @param route The route segment to check
   * @returns True if the route is active
   */
  isRouteActive(route: string): boolean {
    return this._router.url.includes(route);
  }
}
