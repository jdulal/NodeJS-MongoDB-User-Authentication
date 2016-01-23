app = angular.module("Espresso", [
  "ngRoute"
  ])

#// Routes
app.config(($routeProvider, $locationProvider) ->
  $routeProvider
    .when("/", {
      templateUrl: "/templates/profile.html"
    })
    .otherwise({
      redirectTo: "/not-found"
    })

  $locationProvider.html5Mode(true)
)