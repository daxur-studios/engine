import {
  inject,
  signal,
  runInInjectionContext,
  Inject,
  Injector,
} from '@angular/core';
import { SaveableData } from '../models';
import { GameScene } from '../game/game-scene';
import { GameGroup } from '../game/game-group';
import type { EngineComponent } from '../components';
import { ReplaySubject, BehaviorSubject, takeUntil } from 'rxjs';

export class Actor {
  static InstanceCounts = new Map<string, number>();

  // engine = runInInjectionContext(this.injector, () => inject(EngineService));
  engine?: EngineComponent;

  group: GameGroup;

  parentActor?: Actor;
  childActors: Record<string, Actor | null> = {};

  //#region Events
  isPlaying = signal(false);
  onBeginPlay$ = new ReplaySubject<void>();
  tick$ = new BehaviorSubject<number>(0);
  onSpawn$ = new ReplaySubject<GameScene>();
  onDestroy$ = new ReplaySubject<void>();
  onLoad$ = new BehaviorSubject<Actor | null>(null);
  //#endregion

  constructor() {
    this.updateInstanceCounts();
    this.group = this.createActorGroup();
  }

  onBeginPlay() {
    this.onBeginPlay$.next();
    this.onBeginPlay$.complete();
    this.isPlaying.set(true);
  }

  tick(delta: number) {
    this.tick$.next(delta);
  }

  /** Load from SaveObject */
  load(saveObject: SaveableData) {
    this.group.clear();

    this.onLoad$.next(this);
  }
  save(): SaveableData {
    return {};
  }

  /** Add to Scene */
  spawn(scene: GameScene) {
    this.engine = scene.engine;

    this.onSpawn$.next(scene);
    this.onSpawn$.complete();

    scene.add(this.group);

    this.engine.onBeginPlay$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.onBeginPlay());

    this.engine.tick$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((tick) => this.tick(tick));

    this.engine.onDestroy$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.destroy());
  }

  /**Remove from Scene */
  deSpawn() {
    this.group.removeFromParent();
  }

  destroy() {
    this.deSpawn();

    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private updateInstanceCounts() {
    // Base Class
    Actor.InstanceCounts.set(
      'Actor',
      (Actor.InstanceCounts.get('Actor') || 0) + 1
    );
    // Extended Classes
    Actor.InstanceCounts.set(
      this.constructor.name,
      (Actor.InstanceCounts.get(this.constructor.name) || 0) + 1
    );
  }
  private createActorGroup(): GameGroup {
    const group = new GameGroup();
    group.name = `${this.constructor.name}Group ${Actor.InstanceCounts.get(
      this.constructor.name
    )}`;
    return group;
  }
}
