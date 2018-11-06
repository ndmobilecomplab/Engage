import { Injectable } from '@angular/core';
import { database } from 'firebase';
import { FirebaseConfigProvider } from '../firebase-config/firebase-config';
import firebase from 'firebase';

/*
  Generated class for the FirebaseDatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseDatabaseProvider {
  getLocations(): database.Reference {
    return firebase.database().ref('/locations');
  }

  constructor(private firebaseConfig: FirebaseConfigProvider) {
  }

}
