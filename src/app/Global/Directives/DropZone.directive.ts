import { Directive, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDropZone]'
})
export class DropZoneDirective {

  @Output() dropped = new EventEmitter<FileList>();
  @Output() hovered = new EventEmitter<boolean>();

  
  constructor() { }
 
  @HostListener('drop', ['$event'])
  onDrop($event){
    $event.preventDefault();
    this.dropped.emit($event.dataTransfer.files);
    this.hovered.emit(false);
  }

  @HostListener('dragover',['$event'])
  onDragover($event){
    $event.preventDefault();
    this.hovered.emit(true);
  }
  @HostListener('dragLeave',['$event'])
  onDragleave($event){
    $event.preventDefault();
    this.hovered.emit(false);
  }
}