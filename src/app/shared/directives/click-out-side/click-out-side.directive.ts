import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickoutside]'
})
export class ClickOutSideDirective {

  @Output() appClickoutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {
   }
  @HostListener('document:click', ['$event.target'])
  public onClick(target:any) {
   if(!this.elementRef.nativeElement.contains(target))
    this.appClickoutside.emit() ;
  }
}
