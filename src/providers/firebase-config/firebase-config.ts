import { Injectable } from '@angular/core';
import firebase from 'firebase/app';

/*
Generated class for the FirebaseConfigProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class FirebaseConfigProvider {
  private isInit = false;
  
  constructor() {
  }
  
  init(){
    if(this.isInit) return;
    this.isInit = true;
    const config = {
      //FB CRED
      apiKey: "G_API_KEY",
      authDomain: "G_AUTH_DOMAIN",
      databaseURL: "G_DATABASE_URL",
      projectId: "G_PROJECT_ID",
      storageBucket: "G_PROJECT_ID.appspot.com",
      messagingSenderId: "G_MESSAGING_SENDER_ID"
      //END FB CRED
      // TODO: Replace with your project's customized code snippet
    };
    firebase.initializeApp(config);
  }
  
}
