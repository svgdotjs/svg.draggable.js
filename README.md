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

	// event.detail.event hold the given data explained below

})

// unbind
rect.off('dragstart.namespace')
```

### event.detail

`beforedrag`, `dragstart`, `dragmove` and `dragend` gives you the `event` and the `handler` which calculates the drag.
Except for `beforedrag` the events also give you:

 - `detail.m` transformation matrix to calculate screen coords to coords in the elements userspace
 - `detail.p` pageX and pageY transformed into the elements userspace


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

**Note** that every constraint given is evaluated in the elements coordinate system and not in the screen-space

## Remove
The draggable functionality can be removed calling draggable again with false as argument:

```javascript
rect.draggable(false)
```


## Viewbox
This plugin is viewBox aware but there is only one thing that you need to keep in mind. If you work with a viewBox on the parent element you need to set the width and height attributes to have the same aspect ratio. So let's say you are using `viewbox='0 0 150 100'` you have to make sure the aspect ratio of `width` and `height` is the same:

```javascript
var draw = SVG('paper').viewbox(0, 0, 150, 100).size(600, 400)
```


## Restrictions

- If your root-svg is transformed this plugin won't work properly (Viewbox is possible)
- Furthermore it is not possible to move a rotated or flipped group properly. However transformed nested SVGs are possible and should be used instead.


## Dependencies
This module requires svg.js >= v2.0.1