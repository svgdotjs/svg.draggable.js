# svg.draggable.js

A plugin for the [svgjs.com](http://svgjs.com) library to make elements draggable.

Svg.draggable.js is licensed under the terms of the MIT License.

## Usage

Install the plugin:

    bower install svg.draggable.js

Include this plugin after including the svg.js library in your html document.

```html
<script src="svg.js"></script>
<script src="svg.draggable.js"></script>
```

To make an element draggable just call `draggable()` in the element

```javascript
var draw = SVG('canvas').size(400, 400)
var rect = draw.rect(100, 100)

rect.draggable()
```

Yes indeed, that's it! Now the `rect` is draggable.

## Events
The Plugin fires 4 different events

- beforedrag
- dragstart
- dragmove
- dragend

You can bind/unbind listeners to this events:

```javascript
// bind
rect.on('dragstart.namespace', function(event){

	// event.detail.event hold the mouseevent
    // dragmove and dragend also serves the current delta values (event.detail.delta.x, y, zoom)  
	
    // do stuff

})

// unbind
rect.off('dragstart.namespace')
```

## Constraint
The drag functionality can be limited within a given box. You can pass the the constraint values as an object:

```javascript
rect.draggable({
  minX: 10
, minY: 15
, maxX: 200
, maxY: 100
})
```

For more dynamic constraints a function can be passed as well:

```javascript
rect.draggable(function(x, y) {
  return { x: x < 1000, y: y < 300 }
})
```


## Remove
The draggable functionality can be removed calling draggable again with false as argument:

```javascript
rect.draggable(true)
```


## Viewbox
This plugin is viewBox aware but there is only one thing that you need to keep in mind. If you work with a viewBox on the parent element you need to set the width and height attributes to have the same aspect ratio. So let's say you are using `viewbox='0 0 150 100'` you have to make sure the aspect ratio of `width` and `height` is the same:

```javascript
var draw = SVG('paper').attr('viewBox', '0 0 150 100').size(600, 400)
```


## Dependencies
This module requires svg.js v2.0