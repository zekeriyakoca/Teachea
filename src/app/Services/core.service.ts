import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

constructor(public db: AngularFireDatabase) { }
sidenavOpen:boolean = true;
snackBarMessage:string;

getSectionAsObject(name:string):Observable<any>{
  return this.db.object(name).valueChanges();
}
getSectionAsObjectByKey(name:string,id:string):Observable<any>{
  return this.db.object(name+"/"+id).valueChanges();
}
getSectionAsObjectList(name:string):Observable<any>{
  return this.db.list(name).valueChanges();
}

getSectionAsListFiltered(object:string, filterType:string,filterValue:any):Observable<any>{ 

  return this.db.list(object,ref=>{
    return ref.orderByChild(filterType).equalTo(filterValue)
  }).valueChanges();
}

updateSectionAsObject(name:string,val:any):Promise<any>{
  if(val !== null || val !== undefined){
    return this.db.object(name).update(val);
  }
  return null;
}
updateObject(path:string, filterType:string,filterValue:any, value:object):BehaviorSubject<any>{
  var result:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  this.db.list(path,ref=>ref.orderByChild(filterType).equalTo(filterValue))
  .snapshotChanges().pipe(take(1)).subscribe( actions  => {
     this.db.object(path+"/"+actions[0].key).update(value).then(val=>result.next(val));
  });
  return result;
}
addItemToList(path:string,val:any):Promise<any>{
  if(val !== null || val !== undefined){
    return this.db.list(path).push(val);
  }
  return null;
}
deleteSectionAsObject(name:string):Promise<any>{
    return this.db.object(name).remove();
}

makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


}
