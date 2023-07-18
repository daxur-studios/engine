import { Injector, signal, WritableSignal } from '@angular/core';
import { Euler, Object3D, Vector3 } from 'three';

export class Field<T extends Object = any, K extends keyof T = any> {
  public type: FieldType = 'number';

  get value(): T[K] | undefined {
    return this.object[this.key];
  }

  constructor(
    public object: T,
    public key: K,
    public setter?: (value: T[K]) => void
  ) {
    this.type = this.inferType(object[key]);
  }

  set(value: any) {
    if (this.setter) {
      this.setter(value);
    } else {
      this.object[this.key] = value;
    }
  }

  private inferType(value: any): FieldType {
    if (typeof value === 'string') {
      return 'string';
    }
    if (typeof value === 'number') {
      return 'number';
    }
    if (typeof value === 'boolean') {
      return 'boolean';
    }
    if (value instanceof Vector3) {
      return 'Vector3';
    }
    if (value instanceof Euler) {
      return 'Euler';
    }

    return 'number';
  }
}

export type FieldType = 'string' | 'number' | 'boolean' | 'Vector3' | 'Euler';

export class Vector3Field<
  T extends Object,
  K extends keyof T = keyof T
> extends Field<T, K> {
  constructor(object: T, key: K, setter?: (value: T[K]) => void) {
    super(object, key, setter);

    this.type = 'Vector3';
  }
}

export class EulerField<
  T extends Object,
  K extends keyof T = keyof T
> extends Field<T, K> {
  constructor(object: T, key: K, setter?: (value: T[K]) => void) {
    super(object, key, setter);

    this.type = 'Euler';
  }
}
