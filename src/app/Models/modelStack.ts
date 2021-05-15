import { User } from 'firebase';

export class fbUser {

    constructor(user?:User, firstname?:string, lastname?:string){
        if(user){
            this.uid = user.uid;
            this.email= user.email;
        }
        this.firstname = firstname;
        this.lastname = lastname;
    }

    public uid:string = "";

    public firstname: string = "";

    public lastname: string = "";

    public email:string = "";

    public phoneNumber: string= "";

    public records:Record[]= [];

    public isActive:boolean = true;

}

export class Record{
    /**
     *
     */
    constructor() {
        this.tags = [];
    }
    id:string;
    uid:string;
    level:number
    fileName:string;
    downloadUrl:string;
    thumbUrl:string;
    fileType:string;
    fileLength:number;
    tags:string[];
    dateCreated:string;
    subject:string;
    desc:string;
    class:string;
}

export class Upload {
    public key:string;
    public name:string;
    public url:string;
    public file:File;
    public progress:number;
    public createdAt:Date = new Date();
    constructor(file:File){
        this.file = file;

    }
}
