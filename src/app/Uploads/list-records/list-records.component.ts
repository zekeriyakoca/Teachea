import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CoreService } from 'src/app/Services/core.service';
import { AuthService } from 'src/app/Services/auth.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Record } from 'src/app/Models/modelStack'
import { filter, debounceTime, startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-records',
  templateUrl: './list-records.component.html',
  styleUrls: ['./list-records.component.scss']
})
export class ListRecordsComponent implements OnInit {

  public searchText: BehaviorSubject<string> = new BehaviorSubject<string>("");

  public records: BehaviorSubject<Record[]> = new BehaviorSubject<Record[]>(null);
  public recordsFiltered: BehaviorSubject<Record[]> = new BehaviorSubject<Record[]>(null);

  public selectedClass: string = "";
  public selectedTags: string[] = [];
  public selectedImage: string = "";
  public imageFullScreen: boolean = false;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  allTags: string[] = ["Zor", "Geometri", "Sonra Bakacağım", "Sor", "Matematik"];

  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  colors = ["primay", "accent", "accent"];
  classes = ["5.Sınıf", "6.Sınıf", "7.Sınıf", "8.Sınıf", "9.Sınıf", "10.Sınıf", "11.Sınıf", "12.Sınıf"];
  predefinedTags = ["Zor", "Geometri", "Sonra Bakacağım", "Sor", "Matematik"];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  constructor(public coreService: CoreService, public authService: AuthService, public router: Router) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice()));
  }

  public subscription2 = new Subscription();
  ngOnInit() {
    this.authService.user.pipe(filter(u => u != null)).subscribe(u => {
      if (this.subscription2 != undefined) {
        this.subscription2.unsubscribe();
      }
      this.subscription2 = this.coreService.getSectionAsListFiltered("records", "uid", u.uid).subscribe(val => {
        this.records.next(val);
        this.recordsFiltered.next(this.records.value);
      });
    });
    this.searchText.pipe(debounceTime(500)).subscribe(val => {
      if (this.records.value == undefined) { return; }
      if (val == "") {
        this.recordsFiltered.next(this.records.value);
      }
      else {

        this.recordsFiltered.next(this.records.value.filter(val1 => {
          if (val1.desc == undefined) { return false; }
          if (val1.desc.includes(val)
            || val1.subject.includes(val)
            || val1.class.includes(val)
          )
            return true;
        }));
      }

    });

  }
  addTag(event: MatChipInputEvent): void {

    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        this.selectedTags.push(value.trim());
      }

      if (input) {
        input.value = '';
      }
      this.tagCtrl.setValue(null);
    }
    this.filterByTag();
  }

  removeTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
    this.filterByTag();
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedTags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
    this.filterByTag();
  }
  private filterByTag() {
    if (this.selectedTags.length < 1) {
      this.recordsFiltered.next(this.records.value);
      return;
    }
    this.recordsFiltered.next(this.records.value.filter(val1 => {
      let exist: boolean = false;
      this.selectedTags.forEach(element => {
        if (val1.tags.includes(element)) {
          exist = true;
        }
      });
      if (exist) {
        return true;
      }
      return false;
    }));

  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }
  public filterByClass(val: string) {
    console.error(val);

    if (this.records.value == undefined) { return; }
    if (val == "") {
      this.recordsFiltered.next(this.records.value);
    }
    else {
      this.recordsFiltered.next(this.records.value.filter(val1 => {

        if (val1.class.includes(val))
          return true;
      }));
    }

  }
  public search = (event) => {
    if (event.target.value != null && event.target.value != "") {
      this.searchText.next(event.target.value);
    }

  }
  public goToDetailPage(id: string) {
    this.router.navigate(["detailRecord", id]);//Not İmplemented
  }

  public openFullScreen(image: string) {
    this.selectedImage = image;
    this.imageFullScreen = true;
    // if( event.srcElement.classList.contains("full-screen")){
    //   event.srcElement.classList.remove("full-screen");
    // }
    // else{
    //   event.srcElement.classList.add("full-screen");
    // }

  }


}

