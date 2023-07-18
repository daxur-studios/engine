import { Euler, Quaternion, Vector2, Vector3 } from 'three';

export module IDB {
  export function saveEuler(euler: Euler) {
    return {
      x: euler.x,
      y: euler.y,
      z: euler.z,
      order: euler.order,
      type: 'Euler',
    };
  }

  export function loadEuler(
    eulerIDB: ReturnType<typeof saveEuler> | undefined
  ) {
    if (!eulerIDB) {
      return new Euler(0, 0, 0, 'XYZ');
    }
    return new Euler(eulerIDB.x, eulerIDB.y, eulerIDB.z, eulerIDB.order);
  }

  export function saveVector3(vector: Vector3) {
    return {
      x: vector.x,
      y: vector.y,
      z: vector.z,
      type: 'Vector3',
    };
  }

  export function loadVector3(
    vectorIDB: ReturnType<typeof saveVector3> | undefined
  ) {
    if (!vectorIDB) {
      return new Vector3(0, 0, 0);
    }
    return new Vector3(vectorIDB.x, vectorIDB.y, vectorIDB.z);
  }

  export function saveVector2(vector: Vector2) {
    return {
      x: vector.x,
      y: vector.y,
      type: 'Vector2',
    };
  }

  export function loadVector2(
    vectorIDB: ReturnType<typeof saveVector2> | undefined
  ) {
    if (!vectorIDB) {
      return new Vector2(0, 0);
    }
    return new Vector2(vectorIDB.x, vectorIDB.y);
  }

  export function saveQuaternion(quaternion: Quaternion) {
    return {
      x: quaternion.x,
      y: quaternion.y,
      z: quaternion.z,
      w: quaternion.w,
      type: 'Quaternion',
    };
  }

  export function loadQuaternion(
    quaternionIDB: ReturnType<typeof saveQuaternion> | undefined
  ) {
    if (!quaternionIDB) {
      return new Quaternion(0, 0, 0, 1);
    }
    return new Quaternion(
      quaternionIDB.x,
      quaternionIDB.y,
      quaternionIDB.z,
      quaternionIDB.w
    );
  }
}
