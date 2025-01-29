# Motion Scrapbook

A repository of small UI instances that experiment with motion and interaction. These are collections of things I've learnt over the past few years.

## Why?
Last year I set myself a task to get better at animation. I wanted to understand the principles of what makes a good animation (more below). To do that I started to experiment with building motion into UI bits that I've worked on. Also I've looked at some killer designers on the web and copied what they were doing.

## Project structure
A simple React + Vite app with Tailwind 4 and a few other bits. Everything important is stored in `/src`.
- **/primitives**: Basic UI components. Typically wrappers around Radix UI.
- **/components**: Specific components and motion examples
- **/lib**: Other bits

## Motion best practices
- Most animations can be handled by CSS rather than JavaScript. This reduces bundle-size, complexity, and improves performance in most cases.
-  Use motion sparingly. Actions that are frequent and low in novelty should avoid extraneous animations: 
    - Opening a right click menu
    - Deleting or adding items from a list
    - Hovering trivial buttons
- Always respect `prefers-reduced-motion`. Bonus points for offering using control to toggle this on/off.
- Think about motion as if the elements were physical objects. Respect origin, gravity etc.
- Animation values should be proportional to the trigger size:
    - Don't animate dialog scale in from 0 → 1, fade opacity and scale from ~0.8
    - Don't scale buttons on press from 1 → 0.8, but ~0.96, ~0.9, or so
    - Duration for animating a sidebar should be smaller than moving an entire page around
- Switching themes should not trigger transitions and animations on elements.
- Looping animations should pause when not visible on the screen to offload CPU and GPU usage
- Use `scroll-behavior: smooth` for navigating to in-page anchors, with an appropriate offset
