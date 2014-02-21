# svg.draggable.js

A plugin for the [svgjs.com](http://svgjs.com) library to make elements draggable.

Svg.draggable.js is licensed under the terms of the MIT License.

## Usage
Include this plugin after including the svg.js library in your html document.

To make an element draggable

```javascript
var draw = SVG('canvas').size(400, 400)
var rect = draw.rect(100, 100)

rect.draggable()
```

Yes indeed, that's it! Now the `rect` is draggable.

## Callbacks
There are four different callbacks available, `beforedrag`, `dragstart`, `dragmove` and `dragend`. This is how you assign them:

```javascript
rect.dragstart = function() {
  ...do your thing...
}
```

The `beforedrag` callback will pass the event in the first argument:

```javascript
rect.beforestart = function(event) {
  ...do your thing...
}
```

The `dragstart`, `dragmove` and `dragend` callbacks will pass the delta values as an object in the first argument and the event as the second:

```javascript
rect.dragmove = function(delta, event) {
  console.log(delta.x, delta.y)
}
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

### More advanced limiting by callback function
Instead of calling draggable() with an object you might also call it with a function. This function can return a boolean or a object of the form {x, y}, to which the element will be moved. "False" skips moving, true moves to raw x, y.

The following example will prevent the rectangle from "crossing the imaginary border" at x = 300:

```javascript
rect.draggable(function (x, y) {
	var res = {x: x, y: y};
	
	if (x > 300) {
		res.x = 300;
	}

	return res;
});
```


## Remove
The draggable functionality van be removed with the `fixed()` method:

```javascript
rect.fixed()
```


## Viewbox
This plugin is viewBox aware but there is only one thing that you need to keep in mind. If you work with a viewBox on the parent element you need to set the width and height attributes to have the same aspect ratio. So let's say you are using `viewbox='0 0 150 100'` you have to make sure the aspect ratio of `width` and `height` is the same:

```javascript
var draw = SVG('paper').attr('viewBox', '0 0 150 100').size(600, 400)
```


## Dependencies
This module requires svg.js v0.11.