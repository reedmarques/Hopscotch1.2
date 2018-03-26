'use strict';

const functions = require('firebase-functions'),
      admin = require('firebase-admin'),
      logging = require('@google-cloud/logging')();

admin.initializeApp(functions.config().firebase);

const stripe = require('stripe')(functions.config().stripe.token),
      currency = functions.config().stripe.currency || 'USD';


//BUGS- isHopOrder is null, customerSource is null
// [START chargecustomer]
// Charge the Stripe customer whenever an amount is written to the users previousOrders
// If charge succeeds, add them to the bars queue, else report error and display it through alert
exports.createStripeCharge = functions.database.ref('/users/{userId}/previousOrders/{id}').onCreate(event => {
  const val = event.data.val();
  var queue = null;
  var application_fee = 0;
  if (val.isHopOrder){
    queue = 'hopQueue',
    application_fee = val.hopCost*100;
  } else {
    queue = 'regularQueue'
  }
  console.log(queue);
  // This onWrite will trigger whenever anything is written to the path, so
  // noop if the charge was deleted, errored out, or the Stripe API returned a result (id exists)
  if (val === null || val.id || val.error) return null;
  return admin.database().ref(`/stripe_customers/${val.bar.key}/authInfo/stripe_user_id`).once('value').then(snapshot => {
    return snapshot.val();
  }).then(barAccountId => {
    console.log(barAccountId, "barAccountId");
    console.log(event.params.userId, 'userId')
  // Look up the default source id for the charged customer
    // return admin.database().ref(`/stripe_customers/${event.params.userId}/payments/{pushId}/id`).once('value').then(snapshot => {
    return admin.database().ref(`stripe_customers/${event.params.userId}/customer_id`).once('value').then(snapshot => {
      return snapshot.val()
    }).then(customer_id => {
      console.log(customer_id,'cust_id');
      return stripe.customers.retrieve(customer_id);
    }).then(customer => {
      console.log(customer.default_source, "defSource");

      // Create a charge using the pushId as the idempotency key, protecting against double charges
      const amount = val.price*100;
      const idempotency_key = event.params.id;
      const customer_id = customer.id;
      const source = customer.default_source;
      // const source = customer.default_source;
      // ADD APPLICATION FEE BACK WHEN LIVE.
      // CONNECT CHARGES WILL GO THROUGH WHEN REAL ACCOUNTS ARE ACTIVE
      let charge = {amount, currency, customer:customer.id};
      console.log(charge, "charge");
      // console.log(stripe.token,'stripe secret token');
      // if (val.source !== null) charge.source = val.source;
      return stripe.charges.create(charge, {stripe_account:barAccountId, idempotency_key:idempotency_key});
    }).then(response => {
        // If the result is successful, write it back to the database
        console.log(response,'resp');
        admin.database().ref(`/stripe_customers/${event.params.userId}/previousOrders`).push(response);
        console.log("About to push");
        return admin.database().ref(`/bars/${val.bar.key}/queues/${queue}`).push(val).then(function(){
          console.log("Pushed to queue");
        });
      }, error => {
        // We want to capture errors and render them in a user-friendly way, while
        // still logging an exception with Stackdriver
        console.log(error,'err');
        alert(error)
        return event.data.adminRef.child('error').set(userFacingMessage(error)).then(() => {
          // event.data.adminRef.remove();
          return reportError(error, {user: event.params.userId});
        });
      }
    );
  });
});
// [END chargecustomer]]

// Update customers default card
exports.changeDefaultCard = functions.database.ref('/users/{userId}/payments/').onUpdate(event => {
  var val = event.data.val();
  console.log(val,'val!');
  var currentDefaultKey = "";
  var customerId = "";
  var cardId = "";
  Object.keys(val).forEach(function(key) {
    console.log(val[key],'val[key]');
    // console.log(val,'val');
    console.log(key,'key');
    console.log('default', val[key].default);
    if (val[key].default){
      currentDefaultKey = key;
      console.log(currentDefaultKey,'currentDefaultKey');
    } else {

    }
  });
  admin.database().ref(`/stripe_customers/${event.params.userId}/payments/${currentDefaultKey}`).once('value').then(snapshot => {
    var info = snapshot.val();
    console.log(info,'info');
    customerId = info.customer;
    console.log(customerId,'customerId');
    cardId = info.id;
    console.log(cardId,'cardId');
  }).then(function(){
    return stripe.customers.update(customerId, {default_source:cardId})
  })
});

//Infinite cycle with add card!!
// Delete a card from a customer
// exports.changeDefaultCard = functions.database.ref('/users/{userId}/payments/{pushId}').onDelete(event => {
//   var key = event.params.pushId;
//   console.log(key,'key');
//   var customer_id = '';
//   var card_id = '';
//   return admin.database().ref(`stripe_customers/${event.params.userId}/payments/${key}/`).once('value').then(snapshot => {
//     var data = snapshot.val();
//     customer_id = data.customer;
//     card_id = data.id;
//   }).then(function(){
//     console.log(customer_id,'customer_id',card_id,'card_id');
//     return stripe.customers.deleteCard(customerId, cardId);
//   }).then(response => {
//       // If the result is successful, write it back to the database
//       admin.database().ref(`stripe_customers/${event.params.userId}/payments/${key}`).remove();
//       console.log('Deleted stripe path');
//       return event.data.adminRef.remove();
//       console.log('Deleted user path');
//     }, error => {
//       // We want to capture errors and render them in a user-friendly way, while
//       // still logging an exception with Stackdriver
//       console.log(error,'err');
//       return event.data.adminRef.child('error').set(userFacingMessage(error)).then(() => {
//         event.data.adminRef.remove();
//         return reportError(error, {user: event.params.userId});
//       });
//     }
//   );
// });


// When a user is created, register them with Stripe
exports.createStripeCustomer = functions.auth.user().onCreate(event => {
  const data = event.data;
  return stripe.customers.create({
    email: data.email
  }).then(customer => {
    return admin.database().ref(`/stripe_customers/${data.uid}/customer_id`).set(customer.id);
  });
});

//Infinite cycle with remove card!!
// Add a payment source (card) for a user by writing a stripe payment source token to Realtime database
exports.addPaymentSource = functions.database.ref('/users/{userId}/payments/{pushId}/').onCreate(event => {
  const source = event.data.val();
  var cardInfo = {};
  var customer_id = '';
  cardInfo['object'] = 'card';
  cardInfo['exp_month']=source['expiry'].substr(0,2);
  cardInfo['exp_year']=`20${source['expiry'].substr(3)}`;
  cardInfo['address_zip']=source['postalCode'];
  cardInfo['number']=source['number'].replace(" ","");
  if (source === null) return null;
  return admin.database().ref(`/stripe_customers/${event.params.userId}/customer_id`).once('value').then(snapshot => {
    customer_id = snapshot.val();
    return snapshot.val();
  }).then(customer => {
    return stripe.customers.createSource(customer, {source:cardInfo});
  }).then(response => {
      stripe.customers.update(customer_id, {default_source:cardInfo});
      return admin.database().ref(`/stripe_customers/${event.params.userId}/payments/${event.data.key}`).set(response);
      // return stripe.customers.update(response.customer, {default_source:response.id});
    }, error => {
      return event.data.adminRef.parent.child('error').set(userFacingMessage(error)).then(() => {
        return reportError(error, {user: event.params.userId});
      });
  });
});

// When a user deletes their account, clean up after them
exports.cleanupUser = functions.auth.user().onDelete(event => {
  return admin.database().ref(`/stripe_customers/${event.data.uid}`).once('value').then(snapshot => {
    return snapshot.val();
  }).then(customer => {
    return stripe.customers.del(customer);
  }).then(() => {
    return admin.database().ref(`/stripe_customers/${event.data.uid}`).remove();
  });
});

// To keep on top of errors, we should raise a verbose error report with Stackdriver rather
// than simply relying on console.error. This will calculate users affected + send you email
// alerts, if you've opted into receiving them.
// [START reporterror]
function reportError(err, context = {}) {
  // This is the name of the StackDriver log stream that will receive the log
  // entry. This name can be any valid log stream name, but must contain "err"
  // in order for the error to be picked up by StackDriver Error Reporting.
  const logName = 'errors';
  const log = logging.log(logName);

  // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
  const metadata = {
    resource: {
      type: 'cloud_function',
      labels: { function_name: process.env.FUNCTION_NAME }
    }
  };

  // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
  const errorEvent = {
    message: err.stack,
    serviceContext: {
      service: process.env.FUNCTION_NAME,
      resourceType: 'cloud_function'
    },
    context: context
  };

  // Write the error log entry
  return new Promise((resolve, reject) => {
    log.write(log.entry(metadata, errorEvent), error => {
      if (error) { reject(error); }
      resolve();
    });
  });
}
// [END reporterror]

// Sanitize the error message for the user
function userFacingMessage(error) {
  return error.type ? error.message : 'An error occurred, developers have been alerted';
}
