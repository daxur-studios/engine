import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WritableSignal, signal } from '@angular/core';
import { GameGroup, IGameGroup } from '../game-group';
import { Feature } from './features/feature';
import type { EngineComponent } from '../../../components';
import { IEngine, SaveableData } from '../../../models';

export class GameActor extends GameGroup implements IGameActor {
  static emoji = '🎭';

  engine?: IEngine;
  actorFeatures = new Map<string, Feature>();

  //#region Events
  isPlaying = signal(false);
  onBeginPlay$ = new ReplaySubject<void>();
  tick$ = new BehaviorSubject<number>(0);
  onSpawn$ = new ReplaySubject<IEngine>();
  onLoad$ = new BehaviorSubject<GameActor | null>(null);
  //#endregion

  constructor() {
    super();
    this.updateInstanceCounts();
  }

  tick(delta: number) {
    this.tick$.next(delta);
  }

  /** Add to Scene */
  spawn(engine: IEngine) {
    this.engine = engine;

    engine.scene.add(this);

    this.onSpawn$.next(engine);

    this.onSpawn$.complete();

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

  onBeginPlay() {
    this.onBeginPlay$.next();
    this.onBeginPlay$.complete();
    this.isPlaying.set(true);
  }

  override destroy() {
    super.destroy();

    this.actorFeatures.forEach((feature) => {
      feature.destroyFeature();
    });
  }

  /** Attaches a `Feature` to this actor. */
  attachFeature(feature: Feature) {
    if (feature instanceof Feature) {
      this.add(feature.group);
    } else {
      throw new Error('Cannot attach non-actor-component to actor.');
    }
  }

  /** Load from SaveObject */
  load(saveObject: SaveableData) {
    this.clear();

    this.actorFeatures.forEach((feature) => {
      feature.loadFeature();
    });

    this.onLoad$.next(this);
  }
  save(): SaveableData {
    return {};
  }

  static InstanceCounts = new Map<string, number>();
  private updateInstanceCounts() {
    // Base Class
    GameActor.InstanceCounts.set(
      'GameActor',
      (GameActor.InstanceCounts.get('GameActor') || 0) + 1
    );
    // Extended Classes
    GameActor.InstanceCounts.set(
      this.constructor.name,
      (GameActor.InstanceCounts.get(this.constructor.name) || 0) + 1
    );

    this.name = `${(this.constructor as any).emoji} ${
      this.constructor.name
    } ${GameActor.InstanceCounts.get(this.constructor.name)}`;
  }
}

export interface IGameActor extends IGameGroup {
  engine?: IEngine;
  actorFeatures: Map<string, Feature>;

  //#region Events
  isPlaying: WritableSignal<boolean>;
  onBeginPlay$: ReplaySubject<void>;
  tick$: BehaviorSubject<number>;
  onSpawn$: ReplaySubject<IEngine>;
  onDestroy$: ReplaySubject<void>;
  /** Event when the actor's load function is called */
  onLoad$: BehaviorSubject<GameActor | null>;
  //#endregion

  tick(delta: number): void;
  spawn(engine: IEngine): void;
  onBeginPlay(): void;
  destroy(): void;

  load(saveObject: SaveableData): void;
  save(): SaveableData;

  /** Attaches a `Feature` to this actor. */
  attachFeature(feature: Feature): void;
}
