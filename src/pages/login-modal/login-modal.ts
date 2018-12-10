import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { FirebaseAuthProvider } from '../../providers/firebase-auth/firebase-auth';
import { Observable } from 'rxjs/Observable';

/**
* Generated class for the LoginModalPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-login-modal',
  templateUrl: 'login-modal.html',
})
export class LoginModal {
  needAccount = false;
  private loginForm : FormGroup;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private formBuilder: FormBuilder, private firebaseAuth: FirebaseAuthProvider, private toastCtrl: ToastController) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      passwordCheck: ['', this.checkPasswords]
    });
  }
  
  submit(){
    if(this.loginForm.status == "VALID"){
      let result: Observable<firebase.auth.UserCredential>;
      if(this.needAccount){
        result = this.firebaseAuth.newAccount(this.loginForm.controls.email.value, this.loginForm.controls.password.value);
      } else {
        result = this.firebaseAuth.signInWithCreds(this.loginForm.controls.email.value, this.loginForm.controls.password.value);
      }
      result.subscribe((result) =>{
        this.navCtrl.pop();
      }, (error) => {
        this.toastCtrl.create({
          message: error,
          duration: 2000
        }).present();
      });
    }
  }
  
  checkPasswords = (control: AbstractControl) => {
    if(this.needAccount && control.value != this.loginForm.controls.password.value){
      return { mismatch: true };
    }
    return;
  }
  
  ionViewDidLoad() {
  }
  
  closeModal(){
    this.viewCtrl.dismiss();
  }
  
  toggle(){
    this.needAccount = !this.needAccount;
  }
  
}
