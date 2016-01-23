(function() {
  var app;

  app = angular.module("Espresso", ["ngRoute"]);

  app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
      templateUrl: "/templates/profile.html"
    }).otherwise({
      redirectTo: "/not-found"
    });
    return $locationProvider.html5Mode(true);
  });

}).call(this);
