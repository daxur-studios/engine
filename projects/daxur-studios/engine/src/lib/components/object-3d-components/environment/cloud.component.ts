import {
  Component,
  WritableSignal,
  effect,
  forwardRef,
  signal,
} from '@angular/core';
import { MeshComponent } from '../mesh.component';

import {
  Object3DComponent,
  provideObject3DComponent,
} from '../object-3d.component';
import {
  Mesh,
  BufferGeometry,
  NormalBufferAttributes,
  Material,
  Object3DEventMap,
  BoxGeometry,
  MeshNormalMaterial,
  MeshStandardMaterial,
  BackSide,
  Color,
  Data3DTexture,
  GLSL3,
  LinearFilter,
  RawShaderMaterial,
  RedFormat,
  Vector3,
  ShaderMaterial,
  ShaderMaterialParameters,
} from 'three';
import { BoxGeometryComponent } from '../geometry.component';
import {
  MeshNormalMaterialComponent,
  MeshStandardMaterialComponent,
  RawShaderMaterialComponent,
  ShaderMaterialComponent,
} from '../material.component';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'cloud',
  standalone: true,
  imports: [
    BoxGeometryComponent,
    MeshNormalMaterialComponent,
    MeshStandardMaterialComponent,
    MeshComponent,
    ShaderMaterialComponent,
    RawShaderMaterialComponent,
  ],
  providers: [provideObject3DComponent(CloudComponent)],
  template: `
    <box-geometry [params]="[1, 1, 1]"></box-geometry>
    <!-- <mesh-standard-material [params]="{ color: 'gray' }" /> -->
    <raw-shader-material [params]="shaderParams()" />
    <ng-content></ng-content>
  `,
})
export class CloudComponent extends MeshComponent {
  override emoji = '☁️';

  constructor() {
    super();

    effect(() => {
      this.mesh().castShadow = true;
    });

    // Texture

    const size = 128;
    const data = new Uint8Array(size * size * size);

    let i = 0;
    const scale = 0.05;
    const perlin = new ImprovedNoise();
    const vector = new Vector3();

    for (let z = 0; z < size; z++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const d =
            1.0 -
            vector
              .set(x, y, z)
              .subScalar(size / 2)
              .divideScalar(size)
              .length();
          data[i] =
            (128 +
              128 *
                perlin.noise((x * scale) / 1.5, y * scale, (z * scale) / 1.5)) *
            d *
            d;
          i++;
        }
      }
    }

    const texture = new Data3DTexture(data, size, size, size);
    texture.format = RedFormat;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.unpackAlignment = 1;
    texture.needsUpdate = true;

    // Material

    const vertexShader = /* glsl */ `
              in vec3 position;
    
              uniform mat4 modelMatrix;
              uniform mat4 modelViewMatrix;
              uniform mat4 projectionMatrix;
              uniform vec3 cameraPos;
    
              out vec3 vOrigin;
              out vec3 vDirection;
    
              void main() {
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    
                vOrigin = vec3( inverse( modelMatrix ) * vec4( cameraPos, 1.0 ) ).xyz;
                vDirection = position - vOrigin;
    
                gl_Position = projectionMatrix * mvPosition;
              }
            `;

    const fragmentShader = /* glsl */ `
              precision highp float;
              precision highp sampler3D;
    
              uniform mat4 modelViewMatrix;
              uniform mat4 projectionMatrix;
    
              in vec3 vOrigin;
              in vec3 vDirection;
    
              out vec4 color;
    
              uniform vec3 base;
              uniform sampler3D map;
    
              uniform float threshold;
              uniform float range;
              uniform float opacity;
              uniform float steps;
              uniform float frame;
    
              uint wang_hash(uint seed)
              {
                  seed = (seed ^ 61u) ^ (seed >> 16u);
                  seed *= 9u;
                  seed = seed ^ (seed >> 4u);
                  seed *= 0x27d4eb2du;
                  seed = seed ^ (seed >> 15u);
                  return seed;
              }
    
              float randomFloat(inout uint seed)
              {
                  return float(wang_hash(seed)) / 4294967296.;
              }
    
              vec2 hitBox( vec3 orig, vec3 dir ) {
                const vec3 box_min = vec3( - 0.5 );
                const vec3 box_max = vec3( 0.5 );
                vec3 inv_dir = 1.0 / dir;
                vec3 tmin_tmp = ( box_min - orig ) * inv_dir;
                vec3 tmax_tmp = ( box_max - orig ) * inv_dir;
                vec3 tmin = min( tmin_tmp, tmax_tmp );
                vec3 tmax = max( tmin_tmp, tmax_tmp );
                float t0 = max( tmin.x, max( tmin.y, tmin.z ) );
                float t1 = min( tmax.x, min( tmax.y, tmax.z ) );
                return vec2( t0, t1 );
              }
    
              float sample1( vec3 p ) {
                return texture( map, p ).r;
              }
    
              float shading( vec3 coord ) {
                float step = 0.01;
                return sample1( coord + vec3( - step ) ) - sample1( coord + vec3( step ) );
              }
    
              vec4 linearToSRGB( in vec4 value ) {
                return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
              }
    
              void main(){
                vec3 rayDir = normalize( vDirection );
                vec2 bounds = hitBox( vOrigin, rayDir );
    
                if ( bounds.x > bounds.y ) discard;
    
                bounds.x = max( bounds.x, 0.0 );
    
                vec3 p = vOrigin + bounds.x * rayDir;
                vec3 inc = 1.0 / abs( rayDir );
                float delta = min( inc.x, min( inc.y, inc.z ) );
                delta /= steps;
    
                // Jitter
    
                // Nice little seed from
                // https://blog.demofox.org/2020/05/25/casual-shadertoy-path-tracing-1-basic-camera-diffuse-emissive/
                uint seed = uint( gl_FragCoord.x ) * uint( 1973 ) + uint( gl_FragCoord.y ) * uint( 9277 ) + uint( frame ) * uint( 26699 );
                vec3 size = vec3( textureSize( map, 0 ) );
                float randNum = randomFloat( seed ) * 2.0 - 1.0;
                p += rayDir * randNum * ( 1.0 / size );
    
                //
    
                vec4 ac = vec4( base, 0.0 );
    
                for ( float t = bounds.x; t < bounds.y; t += delta ) {
    
                  float d = sample1( p + 0.5 );
    
                  d = smoothstep( threshold - range, threshold + range, d ) * opacity;
    
                  float col = shading( p + 0.5 ) * 3.0 + ( ( p.x + p.y ) * 0.25 ) + 0.2;
    
                  ac.rgb += ( 1.0 - ac.a ) * d * col;
    
                  ac.a += ( 1.0 - ac.a ) * d;
    
                  if ( ac.a >= 0.95 ) break;
    
                  p += rayDir * delta;
    
                }
    
                color = linearToSRGB( ac );
    
                if ( color.a == 0.0 ) discard;
    
              }
            `;

    const x = {
      glslVersion: GLSL3,
      uniforms: {
        base: { value: new Color(0x798aa0) },
        map: { value: texture },
        cameraPos: { value: new Vector3() },
        threshold: { value: 0.25 },
        opacity: { value: 0.25 },
        range: { value: 0.1 },
        steps: { value: 100 },
        frame: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      side: BackSide,
      transparent: true,
    };
    this.shaderParams.set(x);

    this.engineService.tick$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const camera = this.engineService.camera;

      const mesh = this.mesh();
      const material = mesh.material as ShaderMaterial;
      material.uniforms['cameraPos'].value.copy(camera.position);
      mesh.rotation.y = -performance.now() / 7500;

      material.uniforms['frame'].value++;
    });
  }

  shaderParams = signal<ShaderMaterialParameters>({});
}
