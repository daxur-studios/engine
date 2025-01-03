import { Color } from 'three';
import { abs, add, exp, Fn, mix, positionLocal, select } from 'three/webgpu';
import { hsl, toHsl } from './utils';

export interface IStarParams {
  scale: number;
  density: number;
  variation: number;
  color: Color;
  background: Color;
  seed: number;
}

export const stars = Fn((params: IStarParams) => {
  var pos = positionLocal
    .mul(exp(params.scale.div(2).add(3)))
    .add(params.seed)
    .toVar();

  var k = abs(noise(pos)).pow(10).mul(10);

  k = k.mul(exp(params.density.sub(2)));

  var dS = select(k.greaterThan(0.1), params.variation.mul(noise(pos)), 0);

  var col = toHsl(mix(params.background, params.color, k));

  return hsl(add(col.x, dS), col.y, col.z);
});

export const defaultStarsParams: IStarParams = {
  //$name: 'Stars',

  scale: 2,
  density: 2,
  variation: 0,

  color: new Color(0xfff5f0),
  background: new Color(0x000060),

  seed: 0,
};
