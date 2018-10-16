import { Component, OnInit } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation
} from '@ionic-native/google-maps';
import { LoadingController, ToastController, Platform, NavController } from 'ionic-angular';
import { FirebaseAuthProvider } from '../../providers/firebase-auth/firebase-auth';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: GoogleMap;
  loading: any;
  
  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private firebaseAuth: FirebaseAuthProvider
  ) { }
  
  async ngOnInit() {
    // Since ngOnInit() is executed before `deviceready` event,
    // you have to wait the event.
    if(!this.firebaseAuth.isSignedIn){
      this.navCtrl.push(LoginPage);
    }
    await this.platform.ready();
    await this.loadMap();
  }
  
  loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {
          lat: 41.7002,
          lng: -86.2379
        },
        zoom: 18,
        tilt: 30
      }
    });
    
  }
  
  async centerOnUser() {
    this.map.clear();
    
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
    
    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      this.loading.dismiss();
      console.log(JSON.stringify(location, null ,2));
      
      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: location.latLng,
        zoom: 17,
        tilt: 30
      });
      
      // add a marker
      let marker: Marker = this.map.addMarkerSync({
        //title: 'You are here',
        //snippet: 'This plugin is awesome!',
        position: location.latLng,
        //animation: GoogleMapsAnimation.BOUNCE
      });
      
      /*
      // show the infoWindow
      marker.showInfoWindow();
      
      // If clicked it, display the alert
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        this.showToast('clicked!');
      });*/
    })
    .catch(err => {
      this.loading.dismiss();
      console.log(err);
      this.toastCtrl.create({
        message: err.error_message,
        position: 'bottom'
      }).present();
    });
  }
}