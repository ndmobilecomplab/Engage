import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FirebaseAuthProvider } from '../../providers/firebase-auth/firebase-auth';

/**
* Generated class for the LoginPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseAuth: FirebaseAuthProvider, public toastCtrl: ToastController) {
  }
  
  loginAnonymously(){
    this.firebaseAuth.signInAnonymously().subscribe((successful) => {
      if(successful){
        this.navCtrl.pop();
      } else {
        this.toastCtrl.create({
          message: 'Failed to login anonymously',
          duration: 3000,
          position: 'top'
        }).present();
      }
    });
  }
  
}
