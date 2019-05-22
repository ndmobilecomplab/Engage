import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { Environment } from '@ionic-native/google-maps';
import { FirebaseAuthProvider } from '../providers/firebase-auth/firebase-auth';
import { EventsPage } from '../pages/events/events';
import { NewsPage } from '../pages/news/news';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;  //Can substitute with NewsPage to keep working on News Feed

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private firebaseAuth: FirebaseAuthProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Map', component: HomePage },
      { title: 'Events', component: EventsPage },
      { title: 'News',  component: NewsPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      Environment.setEnv({
        'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyBqbkrAUK0cttecGx-uRnUA-2jbYkl_S8A',
        'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyBqbkrAUK0cttecGx-uRnUA-2jbYkl_S8A'
      });
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  signOut(){
    this.firebaseAuth.signOut();
  }
}
