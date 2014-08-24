'use strict';

var ngVis = angular.module('ngVis', []);

ngVis.directive('visTimeLine', function () {
    return {
      restrict: 'EA',
      transclude: true,
      scope: {
        data: '=',
        options: '=',
        events: '=',
        methods: '='
      },
      link: function (scope, element, attr) {
        var timeline = new vis.Timeline(element[0]);

        var items = new vis.DataSet({
          type: {
            start: 'ISODate',
            end: 'ISODate'
          }
        });

        var groups = new vis.DataSet();

        // var count = items.get().length;
        /*
         if (count > 0) {
         items.update(data);
         } else {
         items.add(data);
         }
         */

        scope.$watch('data', function () {
          if (angular.isArray(scope.data)) {
            timeline.clear({groups: true});
            items.clear();
            items.add(scope.data);
            timeline.setItems(scope.data);
          } else if (angular.isObject(scope.data) && scope.data.hasOwnProperty('groups')) {
            groups.clear();
            groups.add(scope.data.groups);
            timeline.setGroups(scope.data.groups);
            items.clear();
            items.add(scope.data.items);
            timeline.setItems(scope.data.items);
          }
        });

        scope.$watch('options', function (options) {
          timeline.clear({options: true});
          timeline.setOptions(options);
          timeline.fit();
        });


        // ***********************************************************************************************************


        // TODO: Investigate!
        scope.$watch('events', function (events) {
          if (events.timechange) {
            timeline.on('timechange', events.timechange);
          }
        });

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
  }
)
;