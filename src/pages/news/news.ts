import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseAuthProvider } from '../../providers/firebase-auth/firebase-auth';
import { FirebaseDatabaseProvider } from '../../providers/firebase-database/firebase-database';
//import * as firebase from 'Firebase';
import Post from '../../models/post';
import { Observable } from 'rxjs/Observable';


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

  key: string;

  /* Observable tracking changes to the selected observable */
  post$: Observable<Post>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private firebase: FirebaseDatabaseProvider) {
    var currentUser = "NyykdOuLtleuwldNbevmhnQoqjw1"; //Test with this user ID
    console.log(currentUser);
    var myPosts = firebase.getPosts(currentUser); //Called in firebase-database
    /* TODO: figure out a way to iterate over myPosts array and access each postID
    * in the /news/ part of the data.  Store the results in an observable and display
    * the post on the News Feed
    */
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');
    //var posts = {};
    //Creates a listener at the news part of the database
    /*const postRef: firebase.database.Reference = firebase.database().ref('/news/');
    postRef.on('value', postSnapshot => {
      this.posts$ = postSnapshot.val();
    });*/
  }

}
