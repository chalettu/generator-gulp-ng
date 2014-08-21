(function(){
  'use strict';


  angular.module('<%= _.slugify(appname) %>-main',[])
    .config(function () {

    })
    .controller('MainCtrl', function ($scope) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
    });

})();