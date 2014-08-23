'user strict';

var ngVisApp = angular.module('ngVisApp', ['ngVis']);

ngVisApp.controller('appController', function ($scope) {
  $scope.example = 'basicUsage';

  $scope.setExample = function (example) {
    $scope.example = example;
  };
});

ngVisApp.controller('basicUsage', function ($scope) {
  $scope.data = [
    {id: 1, content: 'item 1', start: '2014-04-20'},
    {id: 2, content: 'item 2', start: '2014-04-14'},
    {id: 3, content: 'item 3', start: '2014-04-18'},
    {id: 4, content: 'item 4', start: '2014-04-16', end: '2014-04-19'},
    {id: 5, content: 'item 5', start: '2014-04-25'},
    {id: 6, content: 'item 6', start: '2014-04-27', type: 'point'}
  ];

  $scope.options = {};
});

ngVisApp.controller('interactive', function ($scope) {
  $scope.data = [
    {id: 1, content: 'item 1<br>start', start: '2014-01-23'},
    {id: 2, content: 'item 2', start: '2014-01-18'},
    {id: 3, content: 'item 3', start: '2014-01-21'},
    {id: 4, content: 'item 4', start: '2014-01-19', end: '2014-01-24'},
    {id: 5, content: 'item 5', start: '2014-01-28', type:'point'},
    {id: 6, content: 'item 6', start: '2014-01-26'}
  ];

  $scope.options = {
    start: '2014-01-10',
    end: '2014-02-10',
    orientation: 'top',
    height: '300px',
    editable: true,

    /* alternatively, enable/disable individual actions:

     editable: {
     add: true,
     updateTime: true,
     updateGroup: true,
     remove: true
     },

     */

    showCurrentTime: true
  };
});