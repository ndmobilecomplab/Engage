var firebase = require('firebase');
var GeoFire = require('geofire');
var RSVP = require ('rsvp')

var args = process.argv.slice(2);
email=args[0]
password=args[1]

// Initialize the Firebase SDK
firebase.initializeApp({
    apiKey: "AIzaSyBqbkrAUK0cttecGx-uRnUA-2jbYkl_S8A",
    authDomain: "engage-219920.firebaseapp.com",
    databaseURL: "https://engage-219920.firebaseio.com",
    projectId: "engage-219920",
    storageBucket: "engage-219920.appspot.com",
    messagingSenderId: "498276752871"
});

firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  console.log(error.code);
  console.log(error.message);
});
firebase.auth().onAuthStateChanged(function(user) {
  
  if(user) {
    firebase.auth().currentUser.getIdTokenResult()
    .then((idTokenResult) => {
       // Confirm the user is an Admin.
       if (!!idTokenResult.claims.admin) {
         // Show admin UI.
         console.log("HAS ADMIN CLAIM")
       } else {
         // Show regular user UI.
         console.log("DOES NOT HAVE ADMIN CLAIM")
       }
    })
    .catch((error) => {
      console.log(error);
    });

    //console.log(user);
    firebase.database().ref('/devices').set({});
    firebase.database().ref("/organizations").set({});
    var key = firebase.database().ref("/organizations").push().key;
    firebase.database().ref("/organizations/" + key).set({
       name: "Amazon",
       home: "amazon.com"
     });

     var firebaseMetadata = firebase.database().ref("devices/metadata");
     var firebaseLocations = firebase.database().ref("devices/locations");

     firebaseLocations.set({});

     // Create a new GeoFire instance
     var geoFire = new GeoFire(firebaseLocations);

     // Specify the locations for each
     var uavsLocation = [
       [41.7045, -86.2329],
       [41.7030, -86.2391],
       [41.7050, -86.2345],
       [41.7000, -86.3345],
       [41.7150, -86.2645],
       [41.7080, -86.2995]
     ];

     // Set the initial locations
     var promises = uavsLocation.map(function(location, index) {
       firebaseMetadata.child('uav' + index).set({
         name: "Test UAV",
         owner: key,	/* owner organization */
         purpose: "None",
         type: 'UAV'
       });
       return geoFire.set("uav" + index, location).then(function() {
         console.log("uav" + index + " initially set to [" + location + "]");
       });
     });

     // Once all the fish are in GeoFire, update some of their positions
     var newLocation;
     RSVP.allSettled(promises).then(function() {
       degrees = 0;
       radius = .01;
       setInterval(function(){
         degrees += 5;
         degrees = degrees % 360;
         var arrayLength = uavsLocation.length;
         for (var key = 0; key < arrayLength; key++) {
           loc = [...( uavsLocation[key])];
           console.log(loc);
           if (!key % 2){
             loc[1] -= radius*(key+1) * Math.cos(degrees / 260 * 3.14);
             loc[0] -= radius*(key+2) * Math.sin(degrees / 360 * 3.14);
           }
           else {
             loc[1] += radius*(key+1) * Math.cos(degrees / 260 * 3.14);
             loc[0] += radius*(key-2) * Math.sin(degrees / 360 * 3.14);
           }

           console.log(loc);
           geoFire.set("uav" + key, loc);
         }

       }, 1000);
     }).then(function() {
     }).catch(function(error) {
       // Error case
       log(error);
     });
   }
});


        