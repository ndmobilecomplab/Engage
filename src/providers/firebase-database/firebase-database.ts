import { Injectable } from '@angular/core';
import { database } from 'firebase';
import { FirebaseConfigProvider } from '../firebase-config/firebase-config';
import firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import Organization from '../../models/organization';
import Device from '../../models/device';
import { Observable } from 'rxjs/Observable';
import { Event } from '../../models/event';
import { Observer } from 'rxjs/Observer';
import { TeardownLogic } from 'rxjs/Subscription';
import Post from '../../models/post';
import 'rxjs/add/operator/shareReplay';

/**
 * Injectable class giving access to the Firebase Realtime Database.
 */
@Injectable()
export class FirebaseDatabaseProvider {

  /**
   * @returns A reference to the devices' geofire
   */
  getDevicesLocations(): database.Reference {
    return firebase.database().ref('/devices/locations');
  }

  /**
   * @returns A reference to the events' geofire
   */
  getEventsLocations(): database.Reference {
    return firebase.database().ref('/events/locations');
  }

  /**
   * Internal tracker of whether an observable has been created for a particular device
   */
  private devices: { [key: string] : Observable<Device> } = {};

  /**
   * Gets an observable with the most up-to-date information about the device
   * @param {string} key the id of the device
   * @returns An observable containing the most recent information of the device
   */
  getDevice(key: string): Observable<Device> {
    if(!this.devices[key]){
      let generator = (observer: Observer<Device>): TeardownLogic => {
        let callback = (value: database.DataSnapshot) => {
          observer.next(value.val());
        };
        firebase.database().ref('/devices/metadata/' + key).on('value', callback);
        return () => {
          firebase.database().ref('/devices/metadata/' + key).off('value', callback);
        };
      };
      let newObservable: Observable<Device> = Observable.create(generator).share();
      this.devices[key] = newObservable;
    }
    return this.devices[key];
  }

  /**
   * Internal tracker of whether an observable has been created for a particular organization
   */
  private organizations: { [key: string] : Observable<Organization> } = {};

  /**
   * Gets an observable with the most up-to-date information about the organization
   * @param {string} key the id of the organization
   * @returns An observable containing the most recent information of the organization
   */
  getOrganization(key: string): Observable<Organization> {
    if(!this.organizations[key]){
      let generator = (observer: Observer<Organization>): TeardownLogic => {
        let callback = (value: database.DataSnapshot) => {
          observer.next(value.val());
        };
        firebase.database().ref('/organizations/' + key).on('value', callback);
        return () => {
          firebase.database().ref('/organizations/' + key).off('value', callback);
        };
      };
      let newObservable: Observable<Organization> = Observable.create(generator).shareReplay(1);
      this.organizations[key] = newObservable;
    }
    return this.organizations[key];
  }


  /* Attempting to add similar functions for getting post data */

  /**
   * Internal tracker of whether an observable has been created for a particular post
   */
  private news: { [key: string] : Observable<Post> } = {};

  /**
   * Gets an observable with the most up-to-date information about the post
   * @param {string} key Post ID
   * @returns An observable containing the most recent information of the post
   */
   /* IDEA: Do we even need this function?  Maybe have it take in a specific
   * post ID and return the post?  Could call in the getPosts function?
   */

  getPost(key: string): Observable<Post> {
    console.log(this.news);
    if(!this.news[key]){
      let generator = (observer: Observer<Post>): TeardownLogic => {
        let callback = (value: database.DataSnapshot) => {
          observer.next(value.val());
        };
        firebase.database().ref('/news/' + key).on('value', callback);
        return () => {
          firebase.database().ref('/news/' + key).off('value', callback);
        };
      };
      let newObservable: Observable<Post> = Observable.create(generator).shareReplay(1);
      this.news[key] = newObservable;
    }

      return this.news[key];
  }

  /**
   * Gets an observable with all the posts
   * @param {string} key Post ID
   * @returns All the posts
   */

   /* This method will ultimately take in a user ID and pull all of the posts that
   *  that user is subscribed to by looking at their tags.
   */

  getPosts(key: string) {
    var myPosts = new Set(); //This set will store the unique post IDs that a user wants to see
    var userRef = firebase.database().ref("/users/" + key + "/tags/").once('value').then(function(tags) {
      tags.forEach(function(tag){ //For each tag the input user is subscribed to...
        var tagsRef = firebase.database().ref("/tags/" + tag.key + "/posts/").once('value').then(function(posts) {
          posts.forEach(function(post){
            myPosts.add(post.key); //Store post IDs associated with that tag ID
          });
        });
      });
    });

    return myPosts;

    //TODO: figure out a way to iterate through the myPosts set
    //needs to be a way to make it sequential

    //TODO: for each postID in myPosts, create a new reference to /news/ + postID
    //Return the data from this reference as an Observable
    //Display in HTML for NewsPage

}

  /**
   * Internal tracker of whether an observable has been created for a particular event
   */
  private events: { [key: string] : Observable<Event> } = {};

  /**
   * Gets an observable with the most up-to-date information about the event
   * @param {string} key the id of the event
   * @returns An observable containing the most recent information of the event
   */
  getEvent(key: string): Observable<Event> {
    if(!this.events[key]){
      let generator = (observer: Observer<Event>): TeardownLogic => {
        let callback = (value: database.DataSnapshot) => {
          let event = value.val();
          event.key = key;
          observer.next(event);
        };
        firebase.database().ref('/events/metadata/' + key).on('value', callback);
        return () => {
          firebase.database().ref('/events/metadata/' + key).off('value', callback);
        };
      };
      let newObservable: Observable<Event> = Observable.create(generator).shareReplay(1);
      this.events[key] = newObservable;
    }
    return this.events[key];
  }

  constructor(private firebaseConfig: FirebaseConfigProvider) {
    firebaseConfig.init();
  }

}
