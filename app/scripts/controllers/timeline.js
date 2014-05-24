'use strict';

angular.module('ngVisJsApp')
  .controller('TimelineCtrl', function ($scope) {

    $scope.examples = [
      '01. Basic usage',
      '02. Interactive',
      '03. Lots of data',
      '04. HTML data',
      '05. Groups',
      '06. Event listeners',
      '07. Custom time bar',
      '08. Edit items',
      '09. Order groups',
      '10. Points',
      '11. Custom styling',
      '12. Past and future',
      '13. Lots of grouped data',
      '14. Item class names'
    ];

    $scope.exampleIndex = 1;

    $scope.setExample = function (index) {
      $scope.exampleIndex = index;
    }

  });
