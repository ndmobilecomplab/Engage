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
      return;
    }
    await this.platform.ready();
    await this.loadMap();
  }
  
  loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {
          lat: 43.0741704,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    });
    
  }
  
  async onButtonClick() {
    this.map.clear();
    
    this.loading = await this.loadingCtrl.create({
      content: 'Please wait...'
    });
    await this.loading.present();
    
    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      console.log('EHLLOO' + location);
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
        title: '@ionic-native/google-maps plugin!',
        snippet: 'This plugin is awesome!',
        position: location.latLng,
        animation: GoogleMapsAnimation.BOUNCE
      });
      
      // show the infoWindow
      marker.showInfoWindow();
      
      // If clicked it, display the alert
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        this.showToast('clicked!');
      });
    })
    .catch(err => {
      this.loading.dismiss();
      console.log(err);
      this.showToast(err.error_message);
    });
  }
  
  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    
    toast.present();
  }
}