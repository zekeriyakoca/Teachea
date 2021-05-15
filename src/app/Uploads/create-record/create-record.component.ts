import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { Record } from '../../Models/modelStack'
import { finalize, startWith, map, tap, take } from 'rxjs/operators'
import { isNull } from 'util';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { CoreService } from 'src/app/Services/core.service';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { AuthService } from 'src/app/Services/auth.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet, Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/Global/Popups/SnackBar/SnackBar.component';

@Component({
  selector: 'create-record',
  templateUrl: './create-record.component.html',
  styleUrls: ['./create-record.component.scss']
})
export class CreateRecordComponent implements OnInit {

  record: Record = new Record();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  task: AngularFireUploadTask;
  persentage: number = 0;
  persentageSubscription: Subscription;
  snapshot: Observable<any>;

  downloadUrl: Observable<string>;

  isHovered: boolean;
  isHovering: boolean = false;
  subscriptionThumbImage: Subscription;
  subscriptionFullImage: Subscription;
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  allTags: string[] = ["Zor", "Geometri", "Sonra Bakacağım", "Sor", "Matematik"];

  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  colors = ["primay", "accent", "accent"];
  classes = ["5.Sınıf", "6.Sınıf", "7.Sınıf", "8.Sınıf", "9.Sınıf", "10.Sınıf", "11.Sınıf", "12.Sınıf"];
  predefinedTags = ["Zor", "Geometri", "Sonra Bakacağım", "Sor", "Matematik"];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  //Process monitoring
  constructor(public storage: AngularFireStorage,
    public coreService: CoreService,
    private _snackBar: MatSnackBar,
    public authService: AuthService,
    public imageCompress: NgxImageCompressService,
    private http: HttpClient,
    private router:Router) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice()));
  }

  ngOnInit() {

  }

  openSnackBar() {
    return this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 5 * 1000,
      verticalPosition : 'bottom'
    });
  }
  toggleUpload(event: boolean) {
    this.isHovered = event;
  }
  toggleHover(evetn) {
    //Not Implemented
  }
  
  startUpload(event) {
    if(event.target == undefined){
      return;
    }
    const file:File = event.target.files[0];
    if (file.type.split('/')[0] !== 'image') {
      this.coreService.snackBarMessage = "Yanlızca resim yükleyebilirsiniz!";
      this.openSnackBar();
      return;
    }
    let resizeRate:number = 30;
    if(file.size<100000){
      resizeRate = 100;
    }
     
    this.record.fileName = file.name;
    const customMetadata = { app: 'This file is uploaded via app' };
    this.convertBlobToBase64(file).then(fileBase64 => {
      this.imageCompress.compressFile(fileBase64, "-1", resizeRate, 75).then(
        result => {
          let path: string = '/assets/' + new Date().getTime() + '_' + "thumb-" + this.record.fileName + '';
          this.storage.upload(path, this.convertb64ToBlob(result,file.type), { customMetadata }).snapshotChanges().pipe(finalize(() => {
            this.downloadUrl = this.storage.ref(path).getDownloadURL();
            if (this.subscriptionThumbImage == undefined)
              this.subscriptionThumbImage = this.downloadUrl.subscribe(val => this.record.thumbUrl = val);
          })).subscribe();
        }
      );
    });

    let path: string = '/assets/' + new Date().getTime() + '_' + this.record.fileName + '';
    this.task = this.storage.upload(path, file, { customMetadata });
    if (!this.persentageSubscription)
      this.persentageSubscription = this.task.percentageChanges().subscribe(val => this.persentage = val);
    this.snapshot = this.task.snapshotChanges();

    this.snapshot.pipe(finalize(() => {
      if (this.subscriptionFullImage == undefined)
        this.subscriptionFullImage = this.storage.ref(path).getDownloadURL().subscribe(val => this.record.downloadUrl = val);
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

    if (!this.matAutocomplete.isOpen) {
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
    if (index >= 0) {
      this.record.tags.splice(index, 1);
    }
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.record.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }
 
  saveRecord() {
    if (this.record.downloadUrl && this.record.downloadUrl.length > 0) {
      this.record.dateCreated = new Date(Date.now()).toLocaleDateString();
      this.record.uid = this.authService.user.value.uid;
      this.record.id = this.coreService.makeid(20);
      let result = this.coreService.addItemToList("/records", this.record);
      result.then(result => {
        this.coreService.snackBarMessage = "Kaydedildi!";
        this.router.navigate(["detailRecord/"+this.record.id]);
        this.openSnackBar();
      });


    }
    else {
      this.coreService.snackBarMessage = "Önce bir dosya seçmelisiniz.";
      this.openSnackBar();
    }
  }
  private convertb64ToBlob(b64Data,type) {
    let contentType = type;
    let sliceSize = 512;

    b64Data = b64Data.replace(/data\:image\/(jpeg|jpg|png)\;base64\,/gi, '');

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  private convertBlobToBase64 = blob => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }
}

