import * as THREE from "three";
import { createRoot } from "react-dom/client";
import { useState, useRef } from "react";
import { Canvas, ThreeElements, useLoader } from "@react-three/fiber";
import photoSphereImg from "./assets/photo-sphere.jpg";
import { Html, OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";
import "./index.css";

export function Point(props: { position: [number, number, number] }) {
  const [active, setActive] = useState(false);
  return (
    <mesh
      // userData={{ blocking: false }}
      position={props.position}
    >
      <Html>
        <div
          onClick={() => {
            console.debug("click");
            setActive(!active);
          }}
          style={{
            height: "40px",
            width: "40px",
            backgroundColor: "#333",
            borderRadius: "100%",
            transform: "translate(-50%, -50%)",
            content: "''",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              padding: "0.5em",
              transformOrigin: "top left",
              backgroundColor: "#333",
              borderRadius: "0.5em",
              pointerEvents: "none",
              transform: `scale(${active ? 1 : 0})`,
              transition: "transform 0.25s",
              overflow: "visible",
              minWidth: "",
            }}
          >
            amazon link
          </div>
        </div>
      </Html>
      <meshBasicMaterial color="red" />
    </mesh>
  );
}

export function Sphere(props: ThreeElements["mesh"]) {
  const texture = useLoader(TextureLoader, photoSphereImg);
  const ref = useRef<THREE.Mesh>(null!);
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  // useFrame(() => (ref.current.rotation.x = ref.current.rotation.y += 0.01));
  return (
    <mesh
      {...props}
      ref={ref}
      scale={12}
      // onPointerOver={(e) => {
      //   console.debug("sphere over", e);
      // }}
      onDoubleClick={(e) => {
        console.debug("hit", e);
        // add a point on the surface of the sphere
        setPoints((points) => [
          ...points,
          new THREE.Vector3().copy(e.point).normalize(),
        ]);
      }}
    >
      {points.map((point, i) => (
        <Point key={i} position={point.toArray()} />
      ))}
      <sphereGeometry args={[1, 128, 128]} />
      <meshStandardMaterial map={texture} side={1} />
    </mesh>
  );
}
export function MyCanvas() {
  return (
    <Canvas
      raycaster={{
        intersectObjects: (raycaster, objects) => {
          console.debug("raycaster", raycaster, objects);
          return [];
        },
      }}
      resize={{ scroll: false }}
      camera={
        {
          // position: [0, 0, -1],
        }
      }
    >
      <ambientLight intensity={Math.PI / 1} />
      {/* <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      /> */}
      {/* <pointLight position={[5, 10, -10]} decay={0} intensity={10} /> */}
      <Sphere />
      <OrbitControls makeDefault />
    </Canvas>
  );
}

createRoot(document.getElementById("root")!).render(<MyCanvas />);
