import { Directive, ElementRef, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[appCopyright]'
})
export class CopyrightDirective implements OnInit {
  private el = inject(ElementRef);
  private translateService = inject(TranslateService);

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.translateService.stream('copyright.text', { year: currentYear }).subscribe(translatedText => {
      this.el.nativeElement.innerHTML = translatedText;
    });
  }

}
