import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { FirebaseAuthProvider } from '../../providers/firebase-auth/firebase-auth';
import { LoginModal } from '../login-modal/login-modal';

/**
 * Page that the user is shown if they are not logged in
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseAuth: FirebaseAuthProvider, public toastCtrl: ToastController, private modalCtrl: ModalController) {
    firebaseAuth.user.subscribe((user) => {
      if(user){
        navCtrl.pop();
      }
    });
  }
  
  /**
   * Method called by UI to trigger backend service to login the user and show relevant error message
   */
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
  
  /**
   * Method called by UI to trigger backend service to login the user with Google
   */
  loginGoogle(){
    this.firebaseAuth.signInWithGoogle();
  }
  
  /**
   * Method called by the UI to trigger the login with email and password modal
   */
  loginEmailPassword(){
    let loginModal = this.modalCtrl.create(LoginModal);
    loginModal.present();
  }
  
}
