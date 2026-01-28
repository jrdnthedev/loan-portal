import { Directive, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appKeyTrap]',
  standalone: true,
})
export class KeyTrap implements OnInit, OnDestroy {
  private lastFocusedElement: HTMLElement | null = null;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Capture the currently focused element when the directive initializes
    this.captureLastFocusedElement();
    // Focus the first focusable element in the trapped container
    this.focusFirstElement();
  }

  ngOnDestroy(): void {
    // Optionally restore focus when the directive is destroyed
    // This can be useful for modals that are destroyed when closed
    this.restoreFocus();
  }

  /**
   * Captures the currently active element as the last focused element
   */
  private captureLastFocusedElement(): void {
    if (typeof document !== 'undefined') {
      const activeElement = document.activeElement as HTMLElement;
      // Only capture if it's a valid focusable element (not body or null)
      if (activeElement && activeElement !== document.body) {
        this.lastFocusedElement = activeElement;
      }
    }
  }

  /**
   * Restores focus to the last focused element before the key trap was activated
   */
  public restoreFocus(): void {
    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
      try {
        this.lastFocusedElement.focus();
      } catch (error) {
        console.warn('Failed to restore focus to last focused element:', error);
      }
    }
  }

  /**
   * Updates the last focused element reference (useful for dynamic scenarios)
   */
  public updateLastFocusedElement(element: HTMLElement): void {
    this.lastFocusedElement = element;
  }

  /**
   * Gets the last focused element
   */
  public getLastFocusedElement(): HTMLElement | null {
    return this.lastFocusedElement;
  }

  /**
   * Gets all focusable elements within the trapped container
   */
  private getFocusableElements(): NodeListOf<HTMLElement> {
    return this.el.nativeElement.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]):not(.readonly-input), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
  }

  /**
   * Focuses the first focusable element in the trapped container
   */
  public focusFirstElement(): void {
    if (typeof document !== 'undefined') {
      const focusableElements = this.getFocusableElements();

      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        try {
          firstElement.focus();
        } catch (error) {
          console.warn('Failed to focus first element:', error);
        }
      }
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab' && typeof document !== 'undefined') {
      const focusableElements = this.getFocusableElements();

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  }
}
