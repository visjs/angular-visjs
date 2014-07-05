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
      '/timeline', {
        templateUrl: 'views/timeline.html',
        controller: 'timeline'
      })
      .when(
      '/graph', {
        templateUrl: 'views/graph.html',
        controller: 'graph'
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

  })
  .directive(
  'scrollTo', [
    function ()
    {
      return function (scope, elm, attrs)
      {
        elm.bind(
          'click', function (e)
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
