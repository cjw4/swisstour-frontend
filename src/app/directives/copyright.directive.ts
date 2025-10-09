import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCopyright]'
})
export class CopyrightDirective {

  constructor(el: ElementRef) { 
    const currentYear = new Date().getFullYear();
    el.nativeElement.innerHTML = `Copyright &copy; ${currentYear} All rights reserved`;
  }

}
