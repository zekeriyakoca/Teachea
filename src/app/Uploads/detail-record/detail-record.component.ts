import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { Record } from '../../Models/modelStack'
import { finalize, startWith, map, first, take, filter } from 'rxjs/operators'
import { isNull } from 'util';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { CoreService } from 'src/app/Services/core.service';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { AuthService } from 'src/app/Services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { SnackBarComponent } from 'src/app/Global/Popups/SnackBar/SnackBar.component';
import { FileSizePipe } from 'src/app/Global/Pipes/file-size.pipe';

@Component({
  selector: 'detail-record',
  templateUrl: './detail-record.component.html',
  styleUrls: ['./detail-record.component.scss']
})
export class DetailRecordComponent implements OnInit {

  record:Record = new Record();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  task: AngularFireUploadTask;
  persentage: number = 0;
  persentageSubscription: Subscription;
  snapshot: Observable<any>;

  isHovered: boolean;
  isHovering: boolean = false;
  subscription: Subscription;

  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  allTags: string[] = ["Zor", "Geometri", "Sonra Bakacağım", "Sor", "Matematik"];
  colors = ["primay", "accent", "accent"];
  classes = ["5.Sınıf", "6.Sınıf", "7.Sınıf", "8.Sınıf", "9.Sınıf", "10.Sınıf", "11.Sınıf", "12.Sınıf"];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;


  recordId: string = "";
  downloadUrl$:Observable<string> = new Observable<string>();
  //Process monitoring
  constructor(public route: ActivatedRoute, public storage: AngularFireStorage, public coreService: CoreService, private _snackBar: MatSnackBar, public authService: AuthService) {
    this.route.params.subscribe(val => {
      this.recordId = val.id;
      this.fetchRecord();
    });

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice()));
  }

  ngOnInit() {
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 5 * 1000,
      verticalPosition : 'bottom'
    });
  }
  toggleUpload(event: boolean) {
    this.isHovered = event;
  }
  toggleHover(event) {
    //Not Implemented
  }
  public fetchRecord() {
    this.coreService.getSectionAsListFiltered("records", "id", this.recordId).pipe(first()).subscribe((rec:Record) => {
      this.record = rec[0];
  });
}

startUpload(event: FileList) {
  const file = event[0];
  if(file == undefined)
  {return ;}
  if (file.type.split('/')[0] !== 'image') {
    console.error("unsupported file type ");
    
    return;
  }
  this.record.fileName = file.name;
  let path: string = '/assets/' + new Date().getTime() + '_' + file.name + '';
  const customMetadata = { app: 'This file is uploaded via app' };
  this.task = this.storage.upload(path, file, { customMetadata });
  if (!this.persentageSubscription)
    this.persentageSubscription = this.task.percentageChanges().subscribe(val => this.persentage = val);
  this.snapshot = this.task.snapshotChanges();

  this.snapshot.pipe(finalize(() => {
    this.downloadUrl$ = this.storage.ref(path).getDownloadURL();
    if (this.subscription == undefined)
      this.subscription = this.downloadUrl$.subscribe(val => this.record.downloadUrl = val);
  })).subscribe();
}

isActive(snapshot) {
  return (snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes)
}
@ViewChild("fileInput", { static: false }) input: ElementRef;
openFileChoose() {
  if (!isNull(this.input.nativeElement.value))
    this.input.nativeElement.click();

}

addTag(event: MatChipInputEvent): void {

  if(!this.matAutocomplete.isOpen) {
  const input = event.input;
  const value = event.value;

  if ((value || '').trim()) {
    this.record.tags.push(value.trim());
  }

  if (input) {
    input.value = '';
  }
  this.tagCtrl.setValue(null);
}
  }

removeTag(tag: string): void {
  const index = this.record.tags.indexOf(tag);
  if(index >= 0) {
  this.record.tags.splice(index, 1);
}
  }
selected(event: MatAutocompleteSelectedEvent): void {
  this.record.tags.push(event.option.viewValue);
  this.tagInput.nativeElement.value = '';
  this.tagCtrl.setValue(null);
}
  private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();

  return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
}
saveRecord() {
  if (this.record.downloadUrl && this.record.downloadUrl.length > 0) {
    let result = this.coreService.updateObject("/records","id",this.record.id,this.record);
    result.pipe(filter(val=>val!==null)).subscribe(result => {
      this.coreService.snackBarMessage = "Kaydedildi!";
      this.openSnackBar();
    });
  }
  else {
    this.coreService.snackBarMessage = "Önce bir dosya seçmelisiniz.";
    this.openSnackBar();
  }
}

}

