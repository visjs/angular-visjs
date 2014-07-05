'use strict';

angular
  .module(
  'ngVisJsApp', [
    'ngRoute'
    //    ,
    //    'ngVis'
  ])
  .config(
  function ($routeProvider)
  {
    $routeProvider
      .when(
      '/Timeline', {
        templateUrl: 'views/timeline.html',
        controller: 'TimelineCtrl'
      })
      .when(
      '/Graph', {
        templateUrl: 'views/graph.html',
        controller: 'GraphCtrl'
      })
      .otherwise(
      {
        redirectTo: '/Timeline'
      });
  })
  .run(
  [
    '$rootScope', '$location',
    function ($rootScope, $location)
    {
      $rootScope.setPage = function (section)
      {
        $location.path(section);

        $(jQuery.browser.webkit ? 'body' : 'html').scrollTop(0);
      };
    }
  ])
  .directive(
  'scrollto', [
    function ()
    {
      return function (scope, elm, attrs)
      {
        elm.bind(
          'click',
          function (e)
          {
            e.preventDefault();

            if (attrs.href)
            {
              attrs.scrollto = attrs.href;
            }

            var top = $(attrs.scrollto).offset().top - 25;

            $(jQuery.browser.webkit ? 'body' : 'html')
              .animate(
              {
                scrollTop: top
              }, 800);
          }
        );
      };
    }
  ]);
