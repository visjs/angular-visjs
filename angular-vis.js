'use strict';

var ngVis = angular.module('ngVis', []);

ngVis.directive('visTimeLine', function () {
  return {
    element: 'EA',
    transclude: true,
    scope: {
      data: '=',
      options: '=',
      rangechange: '=',
      rangechanged: '=',
      select: '='
    },
    link: function (scope, element, attr) {
      var timeline = new vis.Timeline(element[0]);

      scope.$watch('options', function (options) {
        if (options == {}) timeline.clear({options: true});
        timeline.setOptions(options);
      });

      scope.$watch('data', function (data) {
        render(data);
      });

      function render(data) {
        timeline.setItems(data);
      }

      if (scope.rangechange) {
        timeline.on('rangechange', scope.rangechange);
      }

      if (scope.rangechanged) {
        timeline.on('rangechanged', scope.rangechanged);
      }

      if (scope.select) {
        timeline.on('select', scope.select);
      }
    }
  }
});