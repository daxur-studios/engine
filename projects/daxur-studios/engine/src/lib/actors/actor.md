Here is some suggested markup documentation for the actor.ts file:

# Actor Class

The Actor class is the base class for all actors (game objects) in the game engine.

## Overview

The Actor class handles:

- Tracking instance counts of itself and subclasses using a static `InstanceCounts` Map
- Creating a `GameGroup` to parent all an actor's visual components
- Providing lifecycle hooks like `onBeginPlay`, `tick`, `onSpawn`, and `onDestroy`
- Subscribing to the `EngineComponent` events

## Usage

To create a new Actor subclass:

```ts
class MyActor extends Actor {
  onBeginPlay() {
    // initialization code
  }

  tick(delta: number) {
    // per frame update code
  }
}
```

Then spawn instances into the game scene:

```ts
const actor = new MyActor();
scene.spawn(actor);
```

The Actor will automatically hook into the engine events.

## Properties

- `engine` - The engine component. Set automatically on `spawn()`.
- `group` - The visual GameGroup for this actor.
- `isPlaying` - Whether the actor is currently active in the scene.

## Events

- `onBeginPlay$` - Called when actor is spawned into the scene.
- `tick$` - Called every frame with delta time.
- `onSpawn$` - Called when added to a scene.
- `onDestroy$` - Called when removed from scene.

## Methods

- `load()` - Load actor state from a save file.
- `spawn()` - Spawn actor into scene.
- `deSpawn()` - Remove actor from scene.
- `destroy()` - Handle cleanup when removing from scene.

This covers the key pieces of the Actor class that should be documented! Let me know if you would like me to expand or clarify any part of the documentation.
