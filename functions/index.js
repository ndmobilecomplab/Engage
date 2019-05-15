const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const firebaseAdmin = require('firebase-admin');

firebaseAdmin.initializeApp(functions.config().firebase);

// On sign up.
exports.setAdminOnSignup = functions.auth.user().onCreate((user) => {

    let uid = user.uid;

    //add custom claims
    return firebaseAdmin.auth().setCustomUserClaims(uid,{
        admin: true
    })
    .then(() => {
         //Interesting to note: we need to re-fetch the userRecord, as the user variable **does not** hold the claim
         return firebaseAdmin.auth().getUser(uid);
    })
    .then(userRecord => {
        console.log(uid);
        console.log(userRecord.customClaims.admin);
        return null;
    }); 
});

//from https://medium.com/google-developers/controlling-data-access-using-firebase-auth-custom-claims-88b3c2c9352a
async function grantAdminRole(email) {
    const user = await firebaseAdmin.auth().getUserByEmail(email); // 1
    if (user.customClaims && user.customClaims.admin === true) {
        return;
    } // 2
    return firebaseAdmin.auth().setCustomUserClaims(user.uid, {
        admin: true
    }); // 3
}

exports.addAdmin = functions.https.onCall((data, context) => {
    if (context.auth.token.admin !== true) { // 1
        return {
            error: "Request not authorized. User must be an admin to fulfill request."
        };
    } // 2
    const email = data.email; // 3
    return grantAdminRole(email).then(() => {
        return {
            result: `Request fulfilled! ${email} is now an admin.`
        };
    }); // 4
});
