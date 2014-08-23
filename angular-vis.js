'use strict';

var ngVis = angular.module('ngVis', []);

ngVis.directive('visTimeLine', function () {
  return {
    element: 'EA',
    transclude: true,
    scope: {
      data: '=',
      options: '=',
      events: '=',
      methods: '='
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

      scope.$watch('events', function (events) {
        if (events.timechange) {
          timeline.on('timechange', events.timechange);
        }
      });

      function render(data) {
        timeline.setItems(data);
      }

      if (scope.events.rangechange) {
        timeline.on('rangechange', scope.events.rangechange);
      }

      if (scope.events.rangechanged) {
        timeline.on('rangechanged', scope.events.rangechanged);
      }

      if (scope.events.select) {
        timeline.on('select', scope.events.select);
      }

      if (scope.events.timechange) {
        timeline.on('timechange', scope.events.timechange);
      }

      if (scope.events.timechanged) {
        timeline.on('timechanged', scope.events.timechanged);
      }

      scope.methods = {
        getCustomTime: function () {
          return timeline.getCustomTime();
        },
        setCustomTime: function (time) {
          timeline.setCustomTime(time);
        },
        getWindow: function () {
          return timeline.getWindow();
        },
        setWindow: function (start, end) {
          timeline.setWindow(start, end);
        }
      };

      scope.getCustomTime = timeline.getCustomTime;
    }
  }
});