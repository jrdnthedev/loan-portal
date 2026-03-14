import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { Card } from '../card/card';

export interface NavItem {
  label: string;
  route: string;
  description?: string;
}

@Component({
  selector: 'app-child-nav-layout',
  imports: [RouterOutlet, RouterLink, CommonModule, Card],
  templateUrl: './child-nav-layout.html',
  styleUrl: './child-nav-layout.scss',
})
export class ChildNavLayout implements OnInit {
  @Input() navItems: NavItem[] = [];
  @Input() welcomeTitle: string = '';
  @Input() welcomeDescription: string = '';

  showWelcome = signal(true);
  private router = inject(Router);

  get hasDescriptions(): boolean {
    return this.navItems.some((item) => !!item.description);
  }

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
    // Get the base path (parent route) by removing the last segment
    const urlSegments = currentUrl.split('/').filter((segment) => segment);
    const lastSegment = urlSegments[urlSegments.length - 1];

    // Show welcome only when we're at the parent route with no child route active
    // Check if the last segment matches any of the nav item routes
    const isChildRoute = this.navItems.some((item) => lastSegment === item.route);
    this.showWelcome.set(!isChildRoute);
  }
}
