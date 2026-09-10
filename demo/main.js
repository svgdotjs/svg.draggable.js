import { SVG, Box } from '@svgdotjs/svg.js'
import '../src/svg.draggable.js'

const draw = SVG('#scene').attr({ 'font-size': 10 }).fill('#f06')
const status = document.getElementById('status')

const report = (el, name) =>
  el
    .on('dragstart', () => {
      status.textContent = `dragging: ${name}`
    })
    .on('dragend', () => {
      status.textContent = 'ready'
    })

const label = (text, x, y) => draw.plain(text).center(x, y).fill('#8a93a3')

// plain draggable
report(draw.rect(100, 100).center(150, 150).draggable(), 'plain')
label('just plain draggable', 150, 210)

// grouped draggable - the whole group moves
const group = draw.group().draggable()
group.rect(100, 100).center(400, 150)
report(group, 'group')
label('grouped draggable', 400, 210)

// constrained by another shape, with a ghost following behind
let ghost
let bounds
const constrained = draw.rect(100, 100).center(650, 150).draggable()

report(constrained, 'constrained by shape')
constrained
  .on('dragstart', () => {
    ghost = draw.put(constrained.clone().opacity(0.2))
    bounds = draw.rect(400, 350).move(400, 50).fill('none').stroke('#0fa')
  })
  .on('dragmove', (e) => {
    e.preventDefault()

    const { handler, box } = e.detail
    const limits = bounds.bbox()
    const { x, y } = clamp(box, limits)

    handler.move(x, y)
    ghost.animate(300, '>').move(x, y)
  })
  .on('dragend', () => {
    bounds.remove()
    ghost.remove()
  })
label('constrained with object and ghost', 650, 210)

// constrained by a fixed box
const limits = new Box(750, 0, 300, 300)
const clamped = draw.rect(100, 100).center(900, 150).draggable()

report(clamped, 'constrained by box')
clamped.on('dragmove', (e) => {
  e.preventDefault()

  const { handler, box } = e.detail
  const { x, y } = clamp(box, limits)

  handler.move(x, y)
})
label('constrained with function', 900, 210)

// a draggable group of draggables: dragging a child does not drag the group
const nested = draw.group().draggable()
for (let i = 0; i < 4; i++) {
  const cx = i & 1 ? -25 : 25
  const cy = i & 2 ? -25 : 25
  nested.rect(50, 50).center(cx, cy).draggable()
}
nested.plain('grouped with multiple levels of draggable').center(0, 70)
nested.move(1150, 150)
report(nested, 'nested group')

// keep a box inside the given limits. For nested elements rbox() is the
// better source for the limits than bbox()
function clamp(box, limits) {
  let { x, y } = box

  if (x < limits.x) x = limits.x
  if (y < limits.y) y = limits.y
  if (box.x2 > limits.x2) x = limits.x2 - box.w
  if (box.y2 > limits.y2) y = limits.y2 - box.h

  return { x, y }
}
