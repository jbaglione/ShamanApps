import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[isEllipsisActive]'
})
export class IsEllipsisActiveDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {

    setTimeout(() => {
      const element = this.elementRef.nativeElement;
      // if ( element.offsetWidth < element.scrollWidth) { //HOT FIX
      if ( element.offsetWidth <= element.scrollWidth) {
        if (element.innerHTML.length > 100) {
          element.title = element.innerHTML;
        }
      }
    }, 800);

  }
}
