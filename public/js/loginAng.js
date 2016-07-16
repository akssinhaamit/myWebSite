var app = angular.module("loginApp", ["firebase"]);

// let's create a re-usable factory that generates the $firebaseAuth instance
app.factory("Auth", ["$firebaseAuth",
  function ($firebaseAuth) {
        var ref = new Firebase("https://vivid-fire-1089.firebaseio.com/");
        return $firebaseAuth(ref);
  }
]);

// and use it in our controller
app.controller("SampleCtrl", ["$scope", "Auth",
  function ($scope, Auth) {
        // Registering a new user
        $scope.createUser = function () {
            $scope.message = null;
            $scope.error = null;
            $scope.auth = false;
            var possibleChars = ['abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?_-'];
            var password = '';
            for (var i = 0; i < 16; i += 1) {
                password += possibleChars[Math.floor(Math.random() * possibleChars.length)];
            }
            Auth.$createUser({
                email: $scope.email,
                password: password
            }).then(function (userData) {
                $scope.message = "User created with uid: " + userData.uid;
                Auth.$resetPassword({
                    email: $scope.email
                });
                $.bootstrapGrowl("Thanks! for registering. You will receive an email, use your password to login!", {
                    type: 'success',
                    align: 'left',
                    width: 'auto',
                    allow_dismiss: true
                });
                $('#myModalRegister').modal('hide');
            }).catch(function (error) {
                $scope.error = error;
                $.bootstrapGrowl(error, {
                    type: 'danger',
                    align: 'left',
                    width: 'auto',
                    allow_dismiss: true
                });
            });
        };

        // Removing a user 
        $scope.removeUser = function () {
            $scope.message = null;
            $scope.error = null;

            Auth.$removeUser({
                email: $scope.email,
                password: $scope.password
            }).then(function () {
                $scope.message = "User removed";
            }).catch(function (error) {
                $scope.error = error;
                $.bootstrapGrowl(error, {
                    type: 'danger',
                    align: 'left',
                    width: 'auto',
                    allow_dismiss: true
                });
            });
        };


        // User Login with email
        $scope.authWithPassword = function () {
            $scope.message = null;
            $scope.error = null;

            Auth.$authWithPassword({
                email: $scope.email,
                password: $scope.password
            }).then(function (authData) {
                $scope.auth = true;
                $scope.authData = authData;
                $.bootstrapGrowl("You are now Logged In", {
                    type: 'success',
                    align: 'left',
                    width: 'auto',
                    allow_dismiss: true
                });
                $('#myModal').modal('hide');
                
            }).catch(function (error) {
                $scope.error = error;
                $.bootstrapGrowl(error, {
                    type: 'danger',
                    align: 'left',
                    width: 'auto',
                    allow_dismiss: true
                });
            });
        };

  }
]);