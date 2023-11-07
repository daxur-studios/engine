// function Box(props) {
//     // This reference will give us direct access to the mesh
//     const meshRef = useRef()
//     // Set up state for the hovered and active state
//     const [hovered, setHover] = useState(false)
//     const [active, setActive] = useState(false)
//     // Subscribe this component to the render-loop, rotate the mesh every frame
//     useFrame((state, delta) => (meshRef.current.rotation.x += delta))
//     // Return view, these are regular three.js elements expressed in JSX
//     return (
//       <mesh
//         {...props}
//         ref={meshRef}
//         scale={active ? 1.5 : 1}
//         onClick={(event) => setActive(!active)}
//         onPointerOver={(event) => setHover(true)}
//         onPointerOut={(event) => setHover(false)}>
//         <boxGeometry args={[1, 1, 1]} />
//         <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
//       </mesh>
//     )
//   }

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'renderer',
  template: ``,
  styles: [``],
  standalone: true,
  imports: [CommonModule],
})
export class RendererComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

@Component({
  selector: 'scene',
  template: ``,
  styles: [``],
  standalone: true,
  imports: [CommonModule],
})
export class SceneComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

@Component({
  selector: 'mesh',
  template: ``,
  styles: [``],
  standalone: true,
  imports: [CommonModule],
})
export class MeshComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
