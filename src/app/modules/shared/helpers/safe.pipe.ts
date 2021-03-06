import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: string) {
    if (!url.includes('https://') && !url.includes('http://') ) {
      url = 'https://' + url;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
