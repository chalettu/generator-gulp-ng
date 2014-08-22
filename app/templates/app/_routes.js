angular.module('<%= _.slugify(appname) %>')
.config(
['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {
	    
	$stateProvider
    .state('main', {url: '/', templateUrl: 'main/main.html',controller: 'MainCtrl'});//END OF ROUTES
		$urlRouterProvider.otherwise('/');
}]);