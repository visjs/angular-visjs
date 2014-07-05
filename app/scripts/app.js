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
      $rootScope.pages = {
        Timeline: {
          timeline01: '01. Basic usage',
          timeline02: '02. Interactive',
          timeline03: '03. Lots of data',
          timeline04: '04. HTML data',
          timeline05: '05. Groups',
          timeline06: '06. Event listeners',
          timeline07: '07. Custom time bar',
          timeline08: '08. Edit items',
          timeline09: '09. Order groups',
          timeline10: '10. Points',
          timeline11: '11. Custom styling',
          timeline12: '12. Past and future',
          timeline13: '13. Lots of grouped data',
          timeline14: '14. Item class names'
        },
        Graph: {
          graph01: '01. Basic usage',
          graph02: '02. Random nodes',
          graph03: '03. Images',
          graph04: '04. Shapes',
          graph05: '05. Social network',
          graph06: '06. Groups',
          graph07: '07. Selections',
          graph08: '08. Mobile friendly',
          graph09: '09. Sizing',
          graph10: '10. Multiline text',
          graph11: '11. Custom style',
          graph12: '12. Scalable images',
          graph13: '13. Dashed lines',
          graph14: '14. Dot language',
          graph15: '15. Playground',
          graph16: '16. Dynamic data',
          graph17: '17. Network info',
          graph18: '18. Fully random nodes clustering',
          graph19: '19. Scale free graph clustering',
          graph20: '20. Navigation',
          graph21: '21. Data manipulation',
          graph22: '22. Les miserables',
          graph23: '23. Hierarchical layout',
          graph24: '24. Hierarchical layout predefined',
          graph25: '25. Physics configuration',
          graph26: '26. Graphviz gallery'
        }
      };

      function setupSection (section)
      {
        $rootScope.page = {
          section: section,
          examples: $rootScope.pages[section]
        };

        $(jQuery.browser.webkit ? 'body' : 'html').scrollTop(0);
      }

      setupSection('Timeline');

      $rootScope.setPage = function (section)
      {
        $location.path(section);

        setupSection(section);
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
