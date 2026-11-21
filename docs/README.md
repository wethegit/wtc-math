# wtc-math docs

The documentation site, built with [VitePress](https://vitepress.dev) and published to GitHub Pages at [wethegit.github.io/wtc-math](https://wethegit.github.io/wtc-math/). It follows the [wtc-gl docs](https://github.com/wethegit/wtc-gl/tree/master/packages/docs).

```sh
npm run docs:dev     # API pages, then the dev server on port 5274
npm run docs:build   # API pages, then a static build in docs/.vitepress/dist
```

- Guides are Markdown pages in the section folders (`getting-started/`, `vectors/`, `matrices/` and so on). The sidebar is in `.vitepress/config.mts`.
- `api/` is generated from the TSDoc comments in `src/` by TypeDoc (`npm run docs:api`, configured in `typedoc.json`) and isn't committed. The build fails on an undocumented export or a broken `{@link}`, so document anything you export.
- `Color`, `Plane` and `Ray` are separate entry points; their `@module` comments name them `wtc-math/color` and so on in the API reference.
- Live examples are modules in `examples/`, shown with `<Example>`. Helpers they share are in `examples/lib/`.

## Writing a page

Each page starts with a title and a one-sentence lead, marked `{.lead}`:

```md
# Quaternions

A `Quat` holds a rotation in 3D. {.lead}
```

Then explain the idea in a paragraph or two, show it working, and work through what a reader actually reaches for, each under its own `##` heading. Finish with links to related pages and the API reference.

- Write plainly, in British English (colour, normalise, centre), but keep code names as they are (`Color`, `Plane.normalize`). Short sentences; say what something does and why you'd use it. No "simply", "just", "easy" or "powerful".
- Code is complete enough to paste: imports, then the setup. Check names and behaviour against `src/` rather than memory, and say whether a method changes its object in place or returns a new one.
- Link to API pages by path, without the extension: `[Vec2](/api/wtc-math/classes/Vec2)`, `[Color](/api/wtc-math/color/classes/Color)`. Link to other guides the same way: `[Conventions](/getting-started/conventions)`. The build fails on dead links.
- Use `::: tip` and `::: warning` containers sparingly, for things that trip people up.

## Live examples

An example is a module in `examples/` whose default export takes the element to draw into and returns `{ frame(time, delta), resize(width, height), dispose() }`. Most use the `stage` helper, which makes a 2D canvas and returns that object for you:

```js
import { Vec2 } from 'wtc-math'
import { stage } from './lib/stage.js'
import { arrow } from './lib/draw.js'

export default function (container) {
  return stage(container, ({ ctx, width, height, time, pointer, colours }) => {
    const centre = new Vec2(width / 2, height / 2)
    const tip = pointer ?? centre.addNew(new Vec2(80, 0).rotate(time))
    arrow(ctx, centre, tip, colours.one)
  })
}
```

The draw function runs every frame while the example plays, and again when the pointer moves or the canvas resizes, so interaction works while it's paused. It draws in CSS pixels on a cleared canvas. `pointer` is a `Vec2` or null, and `colours` follow the light and dark themes (`one`, `two`, `three` for series, plus `text`, `muted`, `grid` and `font`).

Show it on a page with its source under it:

```md
<Example src="vec2-projection" :height="340" />

<<< @/examples/vec2-projection.js
```

`<Example>` makes the example when it nears the screen, only calls `frame` while it's visible, and disposes of it when it's far away. Keep examples small and focused on the page's idea, and don't add a render loop or window listeners of your own. Examples import `wtc-math` from `src/`, so they show unreleased changes.
