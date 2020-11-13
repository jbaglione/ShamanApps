import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform, SecurityContext } from '@angular/core';

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private dom: DomSanitizer) {}
  transform(value) {
    // NOTE: Consider using DomSanitizer#sanitize instead of DomSanitizer#bypassSecurityTrustHtml, which executes code in `<script>` tags
    return this.dom.sanitize(SecurityContext.HTML, value);
  }
}
