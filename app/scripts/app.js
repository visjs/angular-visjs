'use strict';

angular
  .module(
  'ngVisJsApp', [
    'ngRoute',
    'ngVis'
  ])
  .config(
  function ($routeProvider)
  {
    $routeProvider
      .when(
      '/timeline', {
        templateUrl: 'views/timeline.html',
        controller: 'TimelineCtrl'
      })
      .when(
      '/graph', {
        templateUrl: 'views/graph.html',
        controller: 'GraphCtrl'
      })
      .otherwise(
      {
        redirectTo: '/timeline'
      });
  })
  .run(
  function ($rootScope)
  {

    $rootScope.pages = [
      'Timeline',
      'Graph'
    ];

  });
