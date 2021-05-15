import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialFileInputModule } from 'ngx-material-file-input';

import { CreateRecordComponent } from './Uploads/create-record/create-record.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import { DropZoneDirective } from './Global/Directives/DropZone.directive';
import { FileSizePipe } from './Global/Pipes/file-size.pipe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AuthService } from './Services/auth.service';
import { CoreService } from './Services/core.service';
import { SessionModule } from './Pages/Session/Session.module';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { MainComponent } from './Pages/Main/Main.component';
import { MenuItems } from './Core/menu/menu-items/menu-items';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ListRecordsComponent } from './Uploads/list-records/list-records.component';
import { DetailRecordComponent } from './Uploads/detail-record/detail-record.component';
import { HttpClientModule } from '@angular/common/http';

import { NgxImageCompressService } from 'ngx-image-compress';
import { SnackBarComponent } from './Global/Popups/SnackBar/SnackBar.component';



@NgModule({
  declarations: [
    AppComponent,
    CreateRecordComponent,
    DropZoneDirective,
    FileSizePipe,
    MainComponent,
    ListRecordsComponent,
    DetailRecordComponent,
    SnackBarComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    MatButtonModule,
    FlexLayoutModule,
    MatCardModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatExpansionModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule,
    MatListModule,
    MatSidenavModule,
    MatTabsModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatSliderModule,
    MatRadioModule,
    MatDialogModule,
    MatGridListModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    SessionModule,
    LoadingBarModule,
    MaterialFileInputModule,
    HttpClientModule

  ],
  providers: [AuthService, CoreService, MenuItems, NgxImageCompressService],
  entryComponents: [
    SnackBarComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
