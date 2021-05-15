import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainComponent } from './Pages/Main/Main.component';
import { CreateRecordComponent } from './Uploads/create-record/create-record.component';
import { ListRecordsComponent } from './Uploads/list-records/list-records.component';
import { DetailRecordComponent } from './Uploads/detail-record/detail-record.component';
import { AuthGuard } from './Services/guard/auth.guard';


const AppRoutes: Routes = [
   {
      path: '',
      redirectTo: 'records',
      pathMatch: 'full',
   },
   {
      path: 'home',
      redirectTo: 'createRecord',
      pathMatch: 'full',
   },
   {
      path: '',
      component: MainComponent,
      children: [
         {
            path: 'createRecord',
            component: CreateRecordComponent,
            canActivate: [AuthGuard]
         },
         {
            path: 'detailRecord/:id',
            component: DetailRecordComponent,
            canActivate: [AuthGuard]
         },
         {
            path: 'records',
            component: ListRecordsComponent,
            canActivate: [AuthGuard]
         },

         {
            path: 'session',
            loadChildren: './Pages/Session/Session.module#SessionModule'
         },

         //  {
         //     path: 'account',
         //     loadChildren: './Pages/UserAccount/UserAccount.module#UserAccountModule',
         //     canActivate: [AuthGuard]
         //  }
      ]
   },
   {
      path: '**',
      redirectTo: 'not-found'
   }
]


@NgModule({
   imports: [RouterModule.forRoot(AppRoutes)],
   exports: [RouterModule]
})
export class AppRoutingModule { }
