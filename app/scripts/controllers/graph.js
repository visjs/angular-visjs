'use strict';

angular.module('ngVisJsApp')
  .controller('GraphCtrl', function ($rootScope, $scope) {

    $rootScope.pageIndex = 2;

    $scope.examples = [
      '01. Basic usage',
      '02. Random nodes',
      '03. Images',
      '04. Shapes',
      '05. Social network',
      '06. Groups',
      '07. Selections',
      '08. Mobile friendly',
      '09. Sizing',
      '10. Multiline text',
      '11. Custom style',
      '12. Scalable images',
      '13. Dashed lines',
      '14. Dot language',
      '15. Playground',
      '16. Dynamic data',
      '17. Network info',
      '18. Fully random nodes clustering',
      '19. Scale free graph clustering',
      '20. Navigation',
      '21. Data manipulation',
      '22. Les miserables',
      '23. Hierarchical layout',
      '24. Hierarchical layout predefined',
      '25. Physics configuration',
      '26. Graphviz gallery'
    ];

    $scope.setExample = function (index) {
      $scope.exampleIndex = index;
    };

    $scope.setExample(1);

  });
