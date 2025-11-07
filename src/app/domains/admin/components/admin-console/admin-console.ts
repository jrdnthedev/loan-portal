import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-console',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './admin-console.html',
  styleUrl: './admin-console.scss',
})
export class AdminConsole implements OnInit {
  showWelcome = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Check initial route
    this.checkRouteState();

    // Listen for route changes
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.checkRouteState()),
      )
      .subscribe();
  }

  private checkRouteState() {
    const currentUrl = this.router.url;
    // Show welcome only when we're exactly at /admin/admin_console with no child route
    this.showWelcome =
      currentUrl.endsWith('/admin_console') || currentUrl.endsWith('/admin_console/');
  }
}
