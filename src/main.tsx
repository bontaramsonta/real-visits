import * as THREE from "three";
import { createRoot } from "react-dom/client";
import { useState, useRef, Suspense } from "react";
import { Canvas, ThreeElements, useLoader } from "@react-three/fiber";
import photoSphereImg from "./assets/photo-sphere.jpg";
import { Html, OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";
import "./index.css";

export function Point(props: { position: [number, number, number] }) {
  const [active, setActive] = useState(false);
  return (
    <mesh position={props.position}>
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
      onDoubleClick={(e) => {
        console.debug("hit", e);
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

export function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
      }}
    >
      loading...
    </div>
  );
}

export function MyCanvas() {
  const [autoRotate] = useState(true);
  return (
    <Suspense fallback={<Loader />}>
      <Canvas
        raycaster={{
          intersectObjects: (raycaster, objects) => {
            console.debug("raycaster", raycaster, objects);
            return [];
          },
        }}
        resize={{ scroll: false }}
        camera={{
          rotation: new THREE.Euler(0, 0, 0),
        }}
      >
        <ambientLight intensity={Math.PI / 1} />
        <Sphere />
        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={0.25}
          enablePan={false}
          minDistance={1}
          maxDistance={10}
          zoomSpeed={2}
          rotateSpeed={-1}
        />
      </Canvas>
    </Suspense>
  );
}

createRoot(document.getElementById("root")!).render(<MyCanvas />);
