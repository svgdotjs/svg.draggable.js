# svg.draggable.js

A plugin for the [svgjs.com](http://svgjs.com) library to make elements draggable.

Svg.draggable.js is licensed under the terms of the MIT License.

## Usage
Include this plugin after including the svg.js library in your html document.

To make an element draggable

```javascript
var draw = svg('paper').size(400, 400);
var rect = draw.rect(100, 100);

rect.draggable();
```

Yes indeed, that's it! Now the `rect` is draggable.

## Dependencies
This plugin requires the event.js module.