'use strict';

var ngVis = angular.module('ngVis', []);

ngVis.factory('visDataSet', function () {

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

  return function (data) {
    var processed;

    if (angular.isArray(data)) {
      items.clear();
      items.add(data);

      processed = {
        load: items,
        single: true
      };
    } else if (angular.isObject(data) && data.hasOwnProperty('groups')) {
      groups.clear();
      items.clear();
      groups.add(data.groups);
      items.add(data.items);

      processed = {
        load: {
          groups: groups,
          items: items
        },
        single: false
      };
    }

    return processed;
  }
});

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

        scope.$watch('data', function () {
          if (scope.data.single) {
            timeline.clear({groups: true});
            timeline.setItems(scope.data.load);
          } else {
            timeline.setGroups(scope.data.load.groups);
            timeline.setItems(scope.data.load.items);
          }
        });

        scope.$watch('options', function (options) {
          timeline.clear({options: true});
          timeline.setOptions(options);
          timeline.fit();
        });

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