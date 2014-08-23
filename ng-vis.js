'use strict';

angular.module('ngVis', []).

  constant(
  'options', {
    orientation: 'bottom',
    direction: 'horizontal',
    autoResize: true,
    stack: true,
    editable: {
      updateTime: false,
      updateGroup: false,
      add: false,
      remove: false
    },
    selectable: true,
    snap: null,
    min: null,
    max: null,
    zoomMin: 10,
    zoomMax: 1000 * 60 * 60 * 24 * 365 * 10000,
    showMinorLabels: true,
    showMajorLabels: true,
    showCurrentTime: false,
    showCustomTime: false,
    type: 'box',
    align: 'center',
    margin: {
      axis: 20,
      item: 10
    },
    padding: 5,
    debug: false,
    start: null,
    end: null,
    height: null,
    width: '100%',
    maxHeight: null,
    groupOrder: 'content'
  }).

  factory('Moment', function () { return vis.moment() }).

  factory(
  'process',
  [
    'options',
    function (options)
    {
      var items,
        groups;

      items = new vis.DataSet(
        {
          convert: {
            start: 'Date',
            end: 'Date'
          }
        }
      );

      groups = new vis.DataSet();

      return function (data)
      {
        items.clear();
        groups.clear();

        var _data = {};

        items.on(
          '*',
          function (event, properties)
          {
            if (options.debug)
            {
              console.log('event=' + angular.toJson(event) + ', ' + 'properties=' + angular.toJson(properties));
            }
          }
        );

        if (angular.isArray(data))
        {
          items.add(data);
        }
        else
        {
          var id = 0;

          angular.forEach(
            data,
            function (_items, _group)
            {
              groups.add(
                {
                  id: id,
                  content: _group
                }
              );

              angular.forEach(
                _items,
                function (item)
                {
                  var _item = {
                    id: item.id,
                    group: id,
                    content: item.content,
                    start: item.start
                  };

                  if (item.hasOwnProperty('end'))
                  {
                    _item.end = item.end;
                  }

                  items.add(_item);
                }
              );

              id ++;
            }
          );

          _data.groups = groups;
        }

        _data.items = items;

        return _data;
      }
    }
  ]).


  directive(
  'timeline',
  [
    'options',
    'process',
    function (options, process)
    {
      return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
          data: '=',
          options: '=',
          // timeline: '='
        },

        controller: function (Moment)
        {
          // console.log('Moment ->', Moment);
        },

        link: function (scope, element, attrs)
        {
          angular.element(element[0]).html('');

          var _timeline = {};

          //          var callbacks = {
          //            onAdd: scope.timeline.slot.add,
          //            onMove: scope.timeline.slot.move,
          //            onUpdate: scope.timeline.slot.update,
          //            onRemove: scope.timeline.slot.remove
          //          };
          //
          //          angular.extend(options, callbacks);

          _timeline = new vis.Timeline(element[0]);

          scope.$watch(
            'data',
            function (data)
            {
              // console.log('data changed!');

              _timeline.clear();

              var _data = process(data);

              if (_data.hasOwnProperty('groups'))
              {
                _timeline.setGroups(_data.groups);
              }
              else
              {
                _timeline.setGroups(null);
              }

              _timeline.setItems(_data.items);

              // console.log('timeline ->', _timeline);

            }, true);

          scope.$watch(
            'options',
            function (_options)
            {
              // console.log('options changed!');

              if (_options.defaults)
              {
                _timeline.clear({options: true});

                // _timeline.setOptions(options);
                // _timeline.setOptions({start: null, end: null});

                // console.log('coming to defaults!');
              }
              else
              {
                // var opts = angular.extend(angular.extend({}, _options), options);
                _timeline.setOptions(_options);
                // _timeline.setWindow(_options.start, _options.end);
                // console.log('setting custom options!');
              }
            }
          );
        }
      };
    }
  ]);