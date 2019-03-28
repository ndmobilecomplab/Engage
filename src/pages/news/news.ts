import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseAuthProvider } from '../../providers/firebase-auth/firebase-auth';
import { FirebaseDatabaseProvider } from '../../providers/firebase-database/firebase-database';
import { Firebase }


/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})

export class NewsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');
    var posts = {};
    //Creates a listener at the news part of the database
    const postRef: firebase.database.Reference = firebase.database().ref('/news/');
    postRef.on('value', postSnapshot => {
      posts = postSnapshot.val();
    });

  }

}
