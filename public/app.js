angular.module('polls', ['pollServices'])
 .config(['$routeProvider', function($routeProvider) {
 $routeProvider.
 when('/polls', { templateUrl: '/list.html', controller:
PollListCtrl }).
 when('/poll/:pollId', { templateUrl: '/item.html', controller:
PollItemCtrl }).
 when('/new', { templateUrl: '/new.html', controller:
PollNewCtrl }).
 otherwise({ redirectTo: '/polls' });
 }]);
