import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FirebaseConfigProvider } from '../providers/firebase-config/firebase-config';
import { FirebaseAuthProvider } from '../providers/firebase-auth/firebase-auth';
import { LoginPage } from '../pages/login/login';
import { LoginModal } from '../pages/login-modal/login-modal';
import { FirebaseDatabaseProvider } from '../providers/firebase-database/firebase-database';
import { GeofireProvider } from '../providers/geofire/geofire';
import { DeviceInfoPage } from '../pages/device-info/device-info';
import { EventsPage } from '../pages/events/events';
import { ComponentsModule } from '../components/components.module';
import { EventDatePage } from '../pages/event-date/event-date';
import { EventInfoPage } from '../pages/event-info/event-info';
import { NewsPage } from '../pages/news/news'; 

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EventsPage,
    EventDatePage,
    EventInfoPage,
    LoginPage,
    LoginModal,
    DeviceInfoPage,
    NewsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EventsPage,
    EventDatePage,
    EventInfoPage,
    LoginPage,
    LoginModal,
    DeviceInfoPage,
    NewsPage
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
