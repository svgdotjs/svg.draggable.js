// svg.draggable.js 0.1.0 - Copyright (c) 2014 Wout Fierens - Licensed under the MIT license
// extended by Florian Loch, reworked from Ulrich-Matthias Schäfer
;(function() {

  SVG.extend(SVG.Element, {
    // Make element draggable
    // Constraint might be a object (as described in readme.md) or a function in the form "function (x, y)" that gets called before every move.
    // The function can return a boolean or a object of the form {x, y}, to which the element will be moved. "False" skips moving, true moves to raw x, y.
    draggable: function(value, constraint, undefined) {
      var start, drag, end, element = this,
        parent = this.parent._parent(SVG.Nested) || this._parent(SVG.Doc),
        parameter = {}

      /* Check the parameters and reassign if needed */
      if (typeof value == 'function' || typeof value == 'object') {
        constraint = value
        value = true
      }

      /* When no parameter is given, our value is true */
      value = value === undefined ? true : value
      constraint = constraint || {}

      /* Remember the constraints on the element because they would be overwritten by the next draggable-call otherwise */
      element.remember('draggable.constraint', constraint)

      /* start dragging */
      start = function(event) {
        event = event || window.event

        /* invoke any callbacks */
        element.fire('draggable.beforedrag', {
          event: event
        })

        /* get element bounding box */
        var box = element.bbox()

        if (element instanceof SVG.G) {
          box.x = element.x()
          box.y = element.y()

        } else if (element instanceof SVG.Nested) {
          box = {
            x: element.x(),
            y: element.y(),
            width: element.width(),
            height: element.height()
          }
        }

        /* store event and start position */
        parameter = {
          event: event,
          position: {
            x: box.x,
            y: box.y,
            width: box.width,
            height: box.height,
            zoom: parent.viewbox().zoom,
            rotation: element.transform('rotation') * Math.PI / 180
          }
        }

        /* add while and end events to window */
        SVG.on(window, 'mousemove', drag)
        SVG.on(window, 'mouseup', end)

        /* invoke any callbacks */
        element.fire('draggable.dragstart', parameter)

        /* prevent selection dragging */
        event.preventDefault ? event.preventDefault() : event.returnValue = false
      }

      /* while dragging */
      drag = function(event) {
        event = event || window.event

        var x, y, constraint = element.remember('draggable.constraint'),
          rotation = parameter.position.rotation,
          width = parameter.position.width,
          height = parameter.position.height,
          delta = {
            x: event.pageX - parameter.event.pageX,
            y: event.pageY - parameter.event.pageY,
            zoom: parameter.position.zoom
          }

        /* caculate new position [with rotation correction] */
        x = parameter.position.x + (delta.x * Math.cos(rotation) + delta.y * Math.sin(rotation)) / parameter.position.zoom
        y = parameter.position.y + (delta.y * Math.cos(rotation) + delta.x * Math.sin(-rotation)) / parameter.position.zoom

        /* move the element to its new position, if possible by constraint */
        if (typeof constraint == 'function') {

          var coord = constraint.call(element, x, y)

          /* bool just show us if movement is allowed or not */
          if (typeof coord == 'boolean') {
            coord = {
              x: coord,
              y: coord
            }
          }

          /* if true, we just move. If !false its a number and we move it there */
          if (coord.x === true) {
            element.x(x)
          } else if (coord.x !== false) {
            element.x(coords.x)
          }

          if (coord.y === true) {
            element.y(y)
          } else if (coord.y !== false) {
            element.y(coords.y)
          }

        } else if (typeof constraint == 'object') {

          /* keep element within constrained box */
          if (constraint.minX != null && x < constraint.minX)
            x = constraint.minX
          else if (constraint.maxX != null && x > constraint.maxX - width)
            x = constraint.maxX - width

          if (constraint.minY != null && y < constraint.minY)
            y = constraint.minY
          else if (constraint.maxY != null && y > constraint.maxY - height)
            y = constraint.maxY - height

          element.move(x, y)
        }

        element.fire('draggable.dragmove', {
          delta: delta,
          event: event
        })


      }

      /* when dragging ends */
      end = function(event) {
        event = event || window.event

        /* calculate move position */
        var delta = {
          x: event.pageX - parameter.event.pageX,
          y: event.pageY - parameter.event.pageY,
          zoom: parameter.position.zoom
        }

        /* remove while and end events to window */
        SVG.off(window, 'mousemove', drag)
        SVG.off(window, 'mouseup', end)

        /* invoke any callbacks */
        element.fire('draggable.dragend', {
          delta: delta,
          event: event
        })
      }

      if (!value) {
        element.off('mousedown', start)
        SVG.off(window, 'mousemove', drag)
        SVG.off(window, 'mouseup', end)

        start = drag = end = null
        return this
      }

      /* bind mousedown event */
      element.on('mousedown', start)

      return this
    }

  })

}).call(this);