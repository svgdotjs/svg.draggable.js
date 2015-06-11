;(function() {

  SVG.extend(SVG.Element, {
    // Make element draggable
    // Constraint might be a object (as described in readme.md) or a function in the form "function (x, y)" that gets called before every move.
    // The function can return a boolean or a object of the form {x, y}, to which the element will be moved. "False" skips moving, true moves to raw x, y.
    draggable: function(value, constraint, undefined) {
      var start, drag, end, parent, element = this,
        parameter = {}

      /* Check the parameters and reassign if needed */
      if (typeof value == 'function' || typeof value == 'object') {
        constraint = value
        value = true
      }

      /* When no parameter is given, our value is true */
      value = value === undefined ? true : value
      constraint = constraint || {}

      if(element.remember('_draggable')){
        element.remember('_draggable', constraint)
        return;
      }
      
      /* Remember the constraints on the element because they would be overwritten by the next draggable-call otherwise */
      element.remember('_draggable', constraint)

      /* start dragging */
      start = function(event) {

        parent = parent || this.parent(SVG.Nested) || this.parent(SVG.Doc)
      
        /* invoke any callbacks */
        element.fire('beforedrag', {
          event: event
        })

        /* get element bounding box */
        var box = element.bbox()

        if (element instanceof SVG.G) {
          box.x = element.x()
          box.y = element.y()

        } else if (element instanceof SVG.Nested) {
            box = element.rbox()
          /*box = {
            x: element.x(),
            y: element.y(),
            width: element.width(),
            height: element.height()
          }*/
          
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
            rotation: element.transform().rotation * Math.PI / 180
          }
        }

        /* add while and end events to window */
        SVG.on(window, 'mousemove.drag', drag)
        SVG.on(window, 'mouseup.drag', end)

        /* invoke any callbacks */
        element.fire('dragstart', parameter)

        /* prevent selection dragging */
        event.preventDefault()
      }

      /* while dragging */
      drag = function(event) {

        var x, y, constraint = element.remember('_draggable'),
          rotation = parameter.position.rotation,
          width = parameter.position.width,
          height = parameter.position.height,
          delta = {
            x: event.pageX - parameter.event.pageX,
            y: event.pageY - parameter.event.pageY,
            zoom: parameter.position.zoom
          }
          
          
        element.fire('dragmove', {
          delta: delta,
          event: event
        })

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



      }

      /* when dragging ends */
      end = function(event) {

        /* calculate move position */
        var delta = {
          x: event.pageX - parameter.event.pageX,
          y: event.pageY - parameter.event.pageY,
          zoom: parameter.position.zoom
        }

        /* remove while and end events to window */
        SVG.off(window, 'mousemove.drag', drag)
        SVG.off(window, 'mouseup.drag', end)

        /* invoke any callbacks */
        element.fire('dragend', {
          delta: delta,
          event: event
        })
      }

      if (!value) {
        element.off('mousedown.drag')
        SVG.off(window, 'mousemove.drag')
        SVG.off(window, 'mouseup.drag')

        start = drag = end = null
        element.forget('_draggable')
        return this
      }

      /* bind mousedown event */
      element.on('mousedown.drag', start)

      return this
    }

  })

}).call(this);