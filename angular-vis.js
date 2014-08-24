'use strict';

var ngVis = angular.module('ngVis', []);

ngVis.directive('visTimeLine', function () {
  return {
    restrict: 'EA',
    transclude: true,
    scope: {
      items: '=',
      options: '=',
      events: '=',
      methods: '='
    },
    link: function (scope, element, attr) {
      var timeline = new vis.Timeline(element[0]);

      scope.$watch('items', function (items) {
        render(items);
      });

      scope.$watch('options', function (options) {
        timeline.clear({options: true});
        timeline.setOptions(options);
        timeline.fit();
      });

      // TODO: Investigate!
      scope.$watch('events', function (events) {
        if (events.timechange) {
          timeline.on('timechange', events.timechange);
        }
      });

      function render(items) {
        timeline.setItems(items);
      }

      if (scope.events.rangechange)   timeline.on('rangechange', scope.events.rangechange);
      if (scope.events.rangechanged)  timeline.on('rangechanged', scope.events.rangechanged);
      if (scope.events.select)        timeline.on('select', scope.events.select);
      if (scope.events.timechange)    timeline.on('timechange', scope.events.timechange);
      if (scope.events.timechanged)   timeline.on('timechanged', scope.events.timechanged);

      scope.methods = {
        getCustomTime: timeline.getCustomTime,
        setCustomTime: function (time) {
          timeline.setCustomTime(time);
        },
        getWindow: timeline.getWindow,
        setWindow: function (start, end) {
          timeline.setWindow(start, end);
        },
        fit: timeline.fit
      };

      // TODO: ???
      scope.getCustomTime = timeline.getCustomTime;
    }
  }
});