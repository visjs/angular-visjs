'use strict';

var ngVis = angular.module('ngVis', []);

ngVis.factory('visDataSet', function () {

  var prepareData = function (data) {
    return new vis.DataSet(data);
  };

  return function (data) {
    return prepareData(data);
  }
});

ngVis.directive('visTimeLine', ['visDataSet', function (visDataSet) {
  return {
    element: 'EA',
    transclude: true,
    scope: {
      data: '=',
      options: '='
    },
    controller: function () {

    },
    link: function (scope, element, attr) {
      scope.$watch('data', function (data) {
        render(data);
      });

      function render(data) {
        data = visDataSet(data);

        new vis.Timeline(element[0], data, scope.options);
      }
    }
  }
}]);