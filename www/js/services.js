'use strict';

// var underscore = angular.module('underscore', []);
// underscore.factory('_', function() {
//   return window._; // assumes underscore has already been loaded on the page
// });

angular.module('app.services', [])
.factory('_', function() {
  return window._;
})
.factory('Users', function($firebaseObject) {

  var usersRef = new Firebase('https://fiery-fire-2843.firebaseio.com/users');
  return {
    // all: function() {
    //   console.log('Users.all called');
    //   return $firebase(usersRef).$asObject();
    // },
    post: function(username, description) {
      console.log('Users.post called');
      var newUserRef = usersRef.$add({username: username, description: description});
    },
    get: function(userID) {
      console.log(userID);
      console.log('Users.get called');
      var ref = usersRef.child(userID);
      return $firebaseObject(ref);
    },

    updateActiveUser: function(userID, groupName, activityType, trueFalse ) {
      console.log(activityType);
      console.log(trueFalse);
      var ref = usersRef.child(userID).child('groups').child(groupName).child(activityType);
      var activity = $firebaseObject(ref);
      console.log(activity);
      activity.$value = trueFalse;
      activity.$save();
    },

    getActivityTypes: function(userID, groupName) {
      var ref = usersRef.child(userID).child('groups').child(groupName);
      var stuff =  $firebaseObject(ref);
      return stuff;
    }

  };
})

.factory('Groups', function($firebaseObject, _) {
  var groupRef = new Firebase('https://fiery-fire-2843.firebaseio.com/groups');

  return {
    all: function() {
      return $firebaseObject(groupRef);
    },
    post: function(group) {
      groupRef.$add(group);
    },
    // temporary, get rid of this later
    // getGroupById: function(groupId) {
    //   var ref = groupRef.child(groupId).child('subgroups');
    //   return $firebase(ref).$asArray();
    // },
    getUserByType: function(groupId, listType) {
      var ref = groupRef.child(groupId).child(listType);
      console.log(ref);
      return $firebaseObject(ref);
    },

    getUsersByTypes: function(groupId, userID) {

      var ref = groupRef.child(groupId);
      var group = $firebaseObject(ref);
      var users = [];

      // still not exactly sure everything going on in here
      return group.$loaded(function(group) {
        angular.forEach(group, function(activityType, key) {
          console.log(key, activityType);

          if (activityType[userID] !== undefined){
              users.push(_.keys(activityType))
          }
       });

        console.log(_.uniq(_.flatten(users)));
        return _.uniq(_.flatten(users));
      });

    },

    updateActiveGroup: function(userID, groupName, activityType, trueFalse) {
      console.log(groupName);
      var ref = groupRef.child(groupName).child(activityType).child(userID);
      var group = $firebaseObject(ref);
      console.log(group);

      if (trueFalse) {
        group.status = 1;
        console.log('activate');
      }
      else if (!trueFalse) {
        group.status = null;
        // group[userID].$save();
        console.log('deactivate');
      }
      group.$save();
    }


    // updateActiveGroup: function(userID, groupName, activityType, trueFalse) {
    //   console.log(groupName);
    //   var ref = groupRef.child(groupName).child(activityType);
    //   var group = $firebase(ref).$asArray();
    //   console.log(group);

    //   if (trueFalse && group.$getRecord(userID) === null ) {
    //       group.push(userID);
    //   }
    //   else if (!trueFalse && group.$getRecord(userID) !== null) {
    //     group.$remove(userID);

    //   }
    // }

    // addUserToGroup: function(userID, groupName, listType) {
    //   var ref = groupRef.child(groupName).child(listType);
    //   var group = $firebase(ref).$asArray();


    // },
    // removeUserFromGroup: function(userID, groupName, listType) {
    //   var ref = groupRef.child(groupName).child(listType);
    //   var group = $firebase(ref).$asArray();

    //   if (group.$getRecord(userID) !== null ) {
    //     group.$remove(userID);
    //   }
    // }
  //   put: function()
  //   // getAllForUser: function(userID) {
  //   //   return $firebase(usersRef.child(userID).child('communities')).$asArray();
  //   // }
  // };

  };
});



