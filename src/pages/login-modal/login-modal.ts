import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { FirebaseAuthProvider } from '../../providers/firebase-auth/firebase-auth';
import { Observable } from 'rxjs/Observable';

/**
 * Modal that allows for a user to sign in or sign up with their username and password
 */
@IonicPage()
@Component({
  selector: 'page-login-modal',
  templateUrl: 'login-modal.html',
})
export class LoginModal {
  /**
   * Switch changing whether the user is shown the sign up or sign in content
   */
  private needAccount = false;

  /**
   * Form group containing the username, password, and potentially confirm password
   */
  private loginForm : FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private formBuilder: FormBuilder, private firebaseAuth: FirebaseAuthProvider, private toastCtrl: ToastController) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      passwordCheck: ['', this.checkPasswords]
    });
  }

  /**
   * Submits the login form, logs in or signs up the user, and handles response appropiately
   */
  submit(): void {
    if(this.loginForm.status == "VALID"){
      console.log("Login form status VALID!")
      let result: Observable<firebase.auth.UserCredential>;
      if(this.needAccount){
        //Added first line for testing
        //this.firebaseAuth.createUserWithEmailAndPassword(this.loginForm.controls.email.value, this.loginForm.controls.password.value)
        console.log("Attempting to create a new account.")
        result = this.firebaseAuth.newAccount(this.loginForm.controls.email.value, this.loginForm.controls.password.value);
      } else {
        //Added first line for testing
        //firebase.auth().signInWithEmailAndPassword(this.loginForm.controls.email.value, this.loginForm.controls.password.value)
        console.log("Attempting to log in.")
        result = this.firebaseAuth.signInWithCreds(this.loginForm.controls.email.value, this.loginForm.controls.password.value);
      }
      result.subscribe((result) =>{
        this.navCtrl.pop();
        //Added logging to see what is happening
        console.log("Done, you are logged in!")
      }, (error) => {
        //Added logging to see what is happening
        console.log("You have problems...")
        this.toastCtrl.create({
          message: error,
          duration: 2000
        }).present();
      });
    }
  }

  /**
   * Function that checks whether the confirm password field is in sync with the password field - given whether the user is loggin in or signing up
   * @returns an object with the mismatch flag if out of sync, otherwise nothing
   */
  checkPasswords = (control: AbstractControl) => {
    if(this.needAccount && control.value != this.loginForm.controls.password.value){
      return { mismatch: true };
    }
    return;
  }

  /**
   * UI triggered action that closes the modal
   */
  private closeModal(){
    this.viewCtrl.dismiss();
  }

  /**
   * UI driven toggle between signing in and signing up
   */
  private toggle(){
    this.needAccount = !this.needAccount;
  }

  /**
  * Function that toggles visibility of password -> work in progress...
  * not right yet
  */
  private showHide(){
    console.log("Hide the password!")
    /**if (this.loginForm.controls.password.value.type == 'text') {
      this.loginForm.controls.password.value.type = 'password'
    }
    else {
      this.loginForm.controls.password.value.type = 'text'
    } **/
  }

}
