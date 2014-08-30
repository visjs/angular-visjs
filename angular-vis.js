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

    var regulate = function (items) {
      angular.forEach(items, function (item) {
        if (! item.hasOwnProperty('type')) {
          item.type = (item.hasOwnProperty('end')) ? 'range' : 'box';
        } else {
          if (item.type == 'range' && ! item.hasOwnProperty('end')) {
            item.type = 'box';
            console.warn('One of the timeline items has been labeled as "range" but no "end" specified!');
          }
        }
      });

      return items;
    };

    if (angular.isArray(data)) {
      items.clear();
      items.add( regulate(data) );

      processed = {
        load: items,
        single: true
      };
    } else if (angular.isObject(data) && data.hasOwnProperty('groups')) {
      groups.clear();
      items.clear();
      groups.add(data.groups);
      items.add( regulate(data.items) );

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

ngVis.directive('vis', function () {
  return {
    restrict: 'E',
    transclude: true,
    controller: function ($scope) {
      this.setTimeline = function (timeline) {
        $scope.timeline = timeline;
      };
    },
    link: function (scope, element, attr) {
    }
  }
});

ngVis.directive('timeLine', function () {
  return {
    restrict: 'E',
    require: '^vis',
    transclude: true,
    scope: {
      data: '=',
      options: '=',
      events: '='
    },
    link: function (scope, element, attr, visCtrl) {
      var timeline = new vis.Timeline(element[0]);

      scope.$watch('data', function () {
        timeline.clear({options: true});

        if (scope.data.single) {
          timeline.clear({groups: true});
          timeline.setItems(scope.data.load);
        } else {
          timeline.setGroups(scope.data.load.groups);
          timeline.setItems(scope.data.load.items);
        }

        timeline.fit();
      });

      scope.$watchCollection('options', function (options) {
        timeline.clear({options: true});
        timeline.setOptions(options);
        // timeline.fit();
      });

      scope.$watch('events', function (events) {
        angular.forEach(events, function (callback, event) {
          if (['rangechange', 'rangechanged', 'select', 'timechange', 'timechanged'].indexOf(String(event)) >= 0) {
            timeline.on(event, callback);
          }
        });
      });

      visCtrl.setTimeline(timeline);
    }
  }
});