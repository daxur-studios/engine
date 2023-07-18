import {
  BufferGeometry,
  Euler,
  GridHelper,
  Line,
  LineBasicMaterial,
  Matrix4,
  Object3D,
  Quaternion,
  Vector3,
} from 'three';

export class Utilities3D {
  /**
   * Creates a straight line.
   * @param color - The color of the line.
   * @returns - A line.
   */
  static line(color: string, points: Vector3[]): Line {
    const material = new LineBasicMaterial({
      color: color,
    });

    const geometry = new BufferGeometry().setFromPoints(points);

    const line = new Line(geometry, material);
    line.name = 'Line';
    // addToScene( line );

    return line;
  }

  static grid(size: number, divisions: number): GridHelper {
    const gridHelper = new GridHelper(size, divisions);
    gridHelper.position.y = -1;
    gridHelper.name = 'Grid Helper';
    return gridHelper;
  }

  /**
   * Creates a vector pointing up.
   * @returns A vector pointing up. `x: 0, y: 1, z: 0`
   */
  static up() {
    return new Vector3(0, 1, 0);
  }
  /**
   * Creates a vector pointing down.
   * @returns A vector pointing down. `x: 0, y: -1, z: 0`
   */
  static down() {
    return new Vector3(0, -1, 0);
  }
  /**
   * Creates a vector pointing left.
   * @returns A vector pointing left. `x: -1, y: 0, z: 0`
   */
  static left() {
    return new Vector3(-1, 0, 0);
  }
  /**
   * Creates a vector pointing right.
   * @returns A vector pointing right. `x: 1, y: 0, z: 0`
   */
  static right() {
    return new Vector3(1, 0, 0);
  }
  /**
   * Creates a vector pointing forward.
   * @returns A vector pointing forward. `x: 0, y: 0, z: -1`
   */
  static forward() {
    return new Vector3(0, 0, 1);
  }
  /**
   * Creates a vector pointing back.
   * @returns A vector pointing back. `x: 0, y: 0, z: 1`
   */
  static back() {
    return new Vector3(0, 0, -1);
  }

  /**
   * Get the right vector of an object.
   * @param mainObject - The object to get the right vector of.
   * @returns The right vector of the object.
   */
  static getRightVector(mainObject: Object3D) {
    const direction = Utilities3D.right();
    direction.applyQuaternion(mainObject.quaternion);
    return direction;
  }

  static rotateAroundVectorAndAxis(
    object: Object3D,
    point: Vector3,
    axis: Vector3,
    radians: number
  ) {
    // Translate the object to the desired point
    object.position.sub(point);

    const rotationMatrix = new Matrix4();
    rotationMatrix.makeRotationAxis(axis.normalize(), radians);
    object.applyMatrix4(rotationMatrix);
  }

  static getRotationToFaceDirection(direction: Vector3): Quaternion {
    const quaternion = new Quaternion();
    quaternion.setFromUnitVectors(Utilities3D.up(), direction);
    return quaternion;
  }
}
