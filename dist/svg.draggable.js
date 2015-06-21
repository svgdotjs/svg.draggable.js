/*! svg.draggable.js - v2.0.0 - 2015-06-21
* https://github.com/wout/svg.draggable.js
* Copyright (c) 2015 Wout Fierens; Licensed MIT */
;(function() {

  // creates handler, saves it
  function DragHandler(el){
    el.remember('_draggable', this)
    this.el = el
  }


  // Sets new parameter, starts dragging
  DragHandler.prototype.init = function(constraint, val){
    var _this = this
    this.constraint = constraint
    this.value = val
    this.el.on('mousedown.drag', function(e){ _this.start(e) })
  }

  // transforms one point from screen to user coords
  DragHandler.prototype.transformPoint = function(x, y){

      this.p.x = x
      this.p.y = y

      return this.p.matrixTransform(this.m);

  }
  
  // gets elements bounding box with specian handling of groups, nested and use
  DragHandler.prototype.getBBox = function(){

    var box = this.el.bbox()

    if(this.el instanceof SVG.Nested) box = this.el.rbox()
    
    if (this.el instanceof SVG.G || this.el instanceof SVG.Use || this.el instanceof SVG.Nested) {
      box.x = this.el.x()
      box.y = this.el.y()
    }

    return box
  }

  // start dragging
  DragHandler.prototype.start = function(e){

    // check for left button
    if((e.which || e.buttons) != 1){
        return
    }
  
    var _this = this

    // fire beforedrag event
    this.el.fire('beforedrag', { event: e, handler: this })

    // search for parent on the fly to make sure we can call
    // draggable() even when element is not in the dom currently
    this.parent = this.parent || this.el.parent(SVG.Nested) || this.el.parent(SVG.Doc)
    this.p = this.parent.node.createSVGPoint()

    // save current transformation matrix
    this.m = this.el.node.getScreenCTM().inverse()

    var box = this.getBBox()
    
    this.startPoints = {
      // We take absolute coordinates since we are just using a delta here
      mouse: this.transformPoint(e.pageX, e.pageY),
      box:   box
    }
    
    // add drag and end events to window
    SVG.on(window, 'mousemove.drag', function(e){ _this.drag(e) })
    SVG.on(window, 'mouseup.drag', function(e){ _this.end(e) })

    // fire dragstart event
    this.el.fire('dragstart', {event: e, p: this.p, m: this.m, handler: this})

    // prevent browser drag behavior
    e.preventDefault()
  }

  // while dragging
  DragHandler.prototype.drag = function(e){

    var box = this.getBBox()
      , p   = this.transformPoint(e.pageX, e.pageY)
      , x   = this.startPoints.box.x + p.x - this.startPoints.mouse.x
      , y   = this.startPoints.box.y + p.y - this.startPoints.mouse.y
      , c   = this.constraint

    this.el.fire('dragmove', { event: e, p: this.p, m: this.m, handler: this })

    // move the element to its new position, if possible by constraint
    if (typeof c == 'function') {

      var coord = c.call(this.el, x, y, this.m)

      // bool, just show us if movement is allowed or not
      if (typeof coord == 'boolean') {
        coord = {
          x: coord,
          y: coord
        }
      }

      // if true, we just move. If !false its a number and we move it there
      if (coord.x === true) {
        this.el.x(x)
      } else if (coord.x !== false) {
        this.el.x(coord.x)
      }

      if (coord.y === true) {
        this.el.y(y)
      } else if (coord.y !== false) {
        this.el.y(coord.y)
      }

    } else if (typeof c == 'object') {

      // keep element within constrained box
      if (c.minX != null && x < c.minX)
        x = c.minX
      else if (c.maxX != null && x > c.maxX - box.width){
        x = c.maxX - box.width
      }if (c.minY != null && y < c.minY)
        y = c.minY
      else if (c.maxY != null && y > c.maxY - box.height)
        y = c.maxY - box.height

      this.el.move(x, y)
    }
  }

  DragHandler.prototype.end = function(e){

    // final drag
    this.drag(e);

    // fire dragend event
    this.el.fire('dragend', { event: e, p: this.p, m: this.m, handler: this })

    // unbind events
    SVG.off(window, 'mousemove.drag')
    SVG.off(window, 'mouseup.drag')

  }

  SVG.extend(SVG.Element, {
    // Make element draggable
    // Constraint might be a object (as described in readme.md) or a function in the form "function (x, y)" that gets called before every move.
    // The function can return a boolean or a object of the form {x, y}, to which the element will be moved. "False" skips moving, true moves to raw x, y.
    draggable: function(value, constraint) {

      // Check the parameters and reassign if needed
      if (typeof value == 'function' || typeof value == 'object') {
        constraint = value
        value = true
      }

      var dragHandler = this.remember('_draggable') || new DragHandler(this)

      // When no parameter is given, value is true
      value = typeof value === 'undefined' ? true : value

      if(value) dragHandler.init(constraint || {}, value)
      else this.off('mousedown.drag')

      return this
    }

  })

}).call(this);