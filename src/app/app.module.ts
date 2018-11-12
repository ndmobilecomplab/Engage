import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FirebaseConfigProvider } from '../providers/firebase-config/firebase-config';
import { FirebaseAuthProvider } from '../providers/firebase-auth/firebase-auth';
import { LoginPage } from '../pages/login/login';
import { LoginModal } from '../pages/login-modal/login-modal';
import { FirebaseDatabaseProvider } from '../providers/firebase-database/firebase-database';
import { GeofireProvider } from '../providers/geofire/geofire';
import { DeviceInfoPage } from '../pages/device-info/device-info';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    LoginModal,
    DeviceInfoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    LoginModal,
    DeviceInfoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseConfigProvider,
    FirebaseAuthProvider,
    FirebaseDatabaseProvider,
    GeofireProvider
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
