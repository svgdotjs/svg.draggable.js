// svg.draggable.js 0.7 - Copyright (c) 2013 Wout Fierens - Licensed under the MIT license

SVG.extend(SVG.Element, {
  // Make element draggable
  draggable: function(constraint) {
    var start, drag, end,
        element = this,
        parent  = this._parent(SVG.Nested) || this._parent(SVG.Doc);
    
    /* ensure constraint object */
    constraint = constraint || {};
    
    /* start dragging */
    start = function(event) {
      var box,
          viewBox = parent.attr('viewBox'),
          width   = parent.attr('width');
      
      /* invoke any callbacks */
      if (element.beforedrag)
        element.beforedrag(event);
      
      /* get element bounding box */
      if (element instanceof SVG.G)
        box = { x: element.transform('x'), y: element.transform('y') };
      else
        box = element.bbox();
      
      /* store event */
      element.startEvent = event || window.event;
      
      /* store start position */
      element.startPosition = {
        x:      box.x
      , y:      box.y
      , width:  box.width
      , height: box.height
      , zoom:   1
      };
      
      /* calculate zoom according to viewbox */
      if (viewBox != null && width != null)
        element.startPosition.zoom = parseFloat(width) / parseFloat(viewBox.split(' ')[2]);
      
      /* add while and end events to window */
      SVG.on(window, 'mousemove', drag);
      SVG.on(window, 'mouseup',   end);
      
      /* invoke any callbacks */
      if (element.dragstart)
        element.dragstart({ x: 0, y: 0, zoom: element.startPosition.zoom }, event);
      
    };
    
    /* while dragging */
    drag = function(event) {
      if (element.startEvent) {
        /* calculate move position */
        var x, y
          , width  = element.startPosition.width
          , height = element.startPosition.height
          , delta  = {
              x:    event.pageX - element.startEvent.pageX,
              y:    event.pageY - element.startEvent.pageY,
              zoom: element.startPosition.zoom
            };
        
        /* caculate new position */
        x = element.startPosition.x + delta.x / element.startPosition.zoom;
        y = element.startPosition.y + delta.y / element.startPosition.zoom;
        
        /* keep element within constrained box */
        if (constraint.minX != null && x < constraint.minX)
          x = constraint.minX;
        else if (constraint.maxX != null && x > constraint.maxX - width)
          x = constraint.maxX - width;
        
        if (constraint.minY != null && y < constraint.minY)
          y = constraint.minY;
        else if (constraint.maxY != null && y > constraint.maxY - height)
          y = constraint.maxY - height;
        
        /* move the element to its new position */
        element.move(x, y);

        /* invoke any callbacks */
        if (element.dragmove)
          element.dragmove(delta, event);
      }
    };
    
    /* when dragging ends */
    end = function(event) {
      /* calculate move position */
      var delta = {
        x:    event.pageX - element.startEvent.pageX,
        y:    event.pageY - element.startEvent.pageY,
        zoom: element.startPosition.zoom
      };
      
      /* reset store */
      element.startEvent    = null;
      element.startPosition = null;

      /* remove while and end events to window */
      SVG.off(window, 'mousemove', drag);
      SVG.off(window, 'mouseup',   end);

      /* invoke any callbacks */
      if (element.dragend)
        element.dragend(delta, event);
    };
    
    /* bind mousedown event */
    element.on('mousedown', start);
    
    /* disable draggable */
    element.fixed = function() {
      element.off('mousedown', start);
      
      SVG.off(window, 'mousemove', drag);
      SVG.off(window, 'mouseup',   end);
      
      start = drag = end = null;
      
      return element;
    };
    
    return this;
  }
  
});