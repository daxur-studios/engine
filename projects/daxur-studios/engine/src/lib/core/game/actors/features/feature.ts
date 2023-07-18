import { ReplaySubject } from 'rxjs';
import { IDB } from '../../../utilities';
import type { GameActor } from '../../actors/game-actor';
import { GameGroup } from '../../game-group';

/** A Feature can be attached to an Actor. This class provides a common interface for all Actor Features. */
export abstract class Feature<A extends GameActor = GameActor> {
  static InstanceCounts = new Map<string, number>();

  actor: A = this.options.actor;

  /** The Feature's Group */
  group = new GameGroup();

  onDestroy$ = new ReplaySubject<void>();

  constructor(public options: IFeatureOptions<A>) {
    Feature.InstanceCounts.set(
      'ActorComponent',
      (Feature.InstanceCounts.get('ActorComponent') || 0) + 1
    );
    Feature.InstanceCounts.set(
      this.constructor.name,
      (Feature.InstanceCounts.get(this.constructor.name) || 0) + 1
    );

    this.group.name = `${
      this.constructor.name
    } Group ${Feature.InstanceCounts.get(this.constructor.name)}`;

    //this.options.actor.childComponents.push(this);
    this.options.actor.actorFeatures.set(this.options.key, this);
    this.options.actor.add(this.group);
  }

  destroyFeature(): void {
    this.group.clear();
    this.group.removeFromParent();

    // remove from Actor's ChildComponents
    // const index = this.options.actor.childComponents.indexOf(this);
    // if (index > -1) {
    //   this.options.actor.childComponents.splice(index, 1);
    // }

    // remove from Actor's ActorComponents
    this.options.actor.actorFeatures.delete(this.options.key);

    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  loadFeature() {
    this.actor.add(this.group);
  }

  save() {
    return {};
  }

  load(saveObject: ReturnType<(typeof this)['save']>) {
    for (const key in saveObject) {
      // Euler
      if (
        (saveObject[key] as ReturnType<typeof IDB.saveEuler>).type === 'Euler'
      ) {
        saveObject[key] = IDB.loadEuler(saveObject[key] as any) as any;
      }
      // Vector3
      else if (
        (saveObject[key] as ReturnType<typeof IDB.saveVector3>).type ===
        'Vector3'
      ) {
        saveObject[key] = IDB.loadVector3(saveObject[key] as any) as any;
      }
    }
  }
}

export interface IFeatureOptions<A extends GameActor = GameActor> {
  actor: A;
  key: string;
}
