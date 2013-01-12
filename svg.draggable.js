// svg.draggable.js 0.2 - Copyright (c) 2013 Wout Fierens - Licensed under the MIT license

SVG.extend(SVG.Element, {
  // Make element draggable
  draggable: function() {
    var drag, end,
        element = this,
        parent  = this._parent(SVG.Nested) || this._parent(SVG.Doc);
    
    /* while dragging */
    drag = function(event) {
      if (element.startEvent) {
        /* calculate move position */
        var delta = {
          x: event.pageX - element.startEvent.pageX,
          y: event.pageY - element.startEvent.pageY
        };

        /* move the element to the right position */
        element.move(
          element.startPosition.x + delta.x / element.startPosition.zoom,
          element.startPosition.y + delta.y / element.startPosition.zoom
        );

        /* invoke any callbacks */
        if (element.dragmove)
          element.dragmove(event, delta);
      }
    };
    
    /* when dragging ends */
    end = function(event) {
      /* reset store */
      element.startEvent    = null;
      element.startPosition = null;

      /* remove while and end events to window */
      SVG.off(window, 'mousemove', drag);
      SVG.off(window, 'mouseup',   end);

      /* invoke any callbacks */
      if (element.dragend)
        element.dragend(event);
    };
    
    /* bind mousedown event */
    this.on('mousedown', function(event) {
      var box     = element.bbox(),
          viewBox = parent.attr('viewBox'),
          width   = parent.attr('width');
      
      /* store event */
      element.startEvent = event || window.event;
      
      /* store start position */
      element.startPosition = {
        x:    box.x,
        y:    box.y,
        zoom: 1
      };
      
      /* calculate zoom according to viewbox */
      if (viewBox != null && width != null)
        element.startPosition.zoom = parseFloat(width) / parseFloat(viewBox.split(' ')[2])
      
      /* add while and end events to window */
      SVG.on(window, 'mousemove', drag);
      SVG.on(window, 'mouseup',   end);
      
      /* invoke any callbacks */
      if (element.dragstart)
        element.dragstart(event);
      
    });
    
    return this;
  }
  
});