import { HttpClient } from '@angular/common/http';
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
    var config = {
      // TODO: Replace with your project's customized code snippet
    };
    firebase.initializeApp(config);
  }

}
