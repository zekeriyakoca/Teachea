import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/Services/core.service';

@Component({
  selector: 'app-SnackBar',
  templateUrl: './SnackBar.component.html',
  styleUrls: ['./SnackBar.component.scss']
})
export class SnackBarComponent {

  constructor(coreService: CoreService) {
    this.message = coreService.snackBarMessage;
  }
  message: string;
}
