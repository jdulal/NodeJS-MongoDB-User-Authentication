(function() {
  var app;

  app = angular.module("Espresso", ["ngRoute"]);

  app.config(function($routeProvider, $locationProvider) {
    return $locationProvider.html5Mode(true);
  });

  app.service("User", [
    "$http", function($http) {
      var findOne, update;
      findOne = function(userID) {
        var promise;
        promise = $http.get("/users/profile.json?user_id=" + userID).success(function(data) {
          return data;
        });
        return promise;
      };
      update = function(user) {
        var promise;
        promise = $http.post("/users/update.json", user).success(function(data) {
          return data;
        });
        return promise;
      };
      return {
        findOne: findOne,
        update: update
      };
    }
  ]);

  app.directive("profileDetails", [
    "User", function(User) {
      return {
        restrict: "A",
        templateUrl: "/templates/users/profile.html",
        link: function($scope, $element, $attrs) {
          return User.findOne($attrs.userId).then(function(data) {
            return $scope.User = data.data;
          });
        }
      };
    }
  ]);

  app.controller("UsersController", [
    "$scope", "User", function($scope, User) {
      return $scope.updateUser = function(user) {
        console.log(user);
        return User.update(user).then(function(data) {
          return console.log(data.data);
        });
      };
    }
  ]);

}).call(this);
