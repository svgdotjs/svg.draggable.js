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

## Viewbox
This plugin is viewBox aware but there is only one thing that you need to keep in mind. If you work with a viewBox on the parent element you need to set the width and height attributes to have the same aspect ratio. So let's say you are using `viewbox='0 0 150 100'` you have to make sure the aspect ratio of `width` and `height` is the same:

```javascript
var draw = svg('paper').attr('viewBox', '0 0 150 100').size(600, 400);
```


## Dependencies
This plugin requires the event.js module.