import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

//Imports Firebase
import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyAmQGjQbJ3y7HFBeI2RI6cdSc7iyLLjVtI",
  authDomain: "datasync-44bee.firebaseapp.com",
  databaseURL: "https://datasync-44bee.firebaseio.com",
  projectId: "datasync-44bee",
  storageBucket: "datasync-44bee.appspot.com",
  messagingSenderId: "398523366455"
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    firebase.initializeApp(config);
  }
}