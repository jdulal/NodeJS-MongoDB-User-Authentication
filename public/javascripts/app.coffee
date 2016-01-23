app = angular.module("Espresso", [
  "ngRoute"
  ])

#// Routes
app.config(($routeProvider, $locationProvider) ->
#   $routeProvider
#     .when("/", {
#       templateUrl: "/templates/profile.html"
#     })
#     .otherwise({
#       redirectTo: "/not-found"
#     })

  $locationProvider.html5Mode(true)
)


#
# Service
#
app.service("User", ["$http", ($http) ->
  findOne = (userID) ->
    promise = $http.get("/users/profile.json?user_id=#{userID}")
      .success((data) ->
        return data
      )
    return promise
  
  update = (user) ->
    promise = $http.post("/users/update.json", user)
      .success((data) ->
        return data
      )
    return promise
  
  return {
    findOne: findOne
    update: update
  }
])

#
# Directive
#
app.directive("profileDetails", ["User", (User) ->
  {
    restrict: "A"
    templateUrl: "/templates/users/profile.html"
    link: ($scope, $element, $attrs) ->
      # load the user
      User.findOne($attrs.userId)
        .then((data) ->
          $scope.User = data.data
        )
  }  
])

#
# Controller
#
app.controller("UsersController", ["$scope", "User", ($scope, User) ->

  $scope.updateUser = (user) ->
    console.log(user)
    User.update(user)
      .then((data) ->
  )
])

