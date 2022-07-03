import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Cylinder, Line } from "@react-three/drei";
import * as THREE from "three";

import RocketModel from "./assets/rocket.glb";

const tempObject = new THREE.Object3D();
const positionOffset = [0.85, 0.5, 0.2];
const catmull_spline = [
  new THREE.Vector3(...positionOffset),
  new THREE.Vector3(
    positionOffset[0] + 0.1,
    positionOffset[1] + 0,
    positionOffset[2] + 1.5
  ),
  new THREE.Vector3(
    positionOffset[0] + 0.3,
    positionOffset[1] + 0,
    positionOffset[2] + 3.5
  ),
  new THREE.Vector3(
    positionOffset[0] + 0.7,
    positionOffset[1] + 0,
    positionOffset[2] + 6
  ),
  new THREE.Vector3(
    positionOffset[0] + 0.9,
    positionOffset[1] + 0,
    positionOffset[2] + 8
  ),
  new THREE.Vector3(
    positionOffset[0] + 1.2,
    positionOffset[1] + 0,
    positionOffset[2] + 10
  ),
];
const curve = new THREE.CatmullRomCurve3(catmull_spline);
const points = curve.getPoints(60);
const octahedronCount = 200;
const smokeArr = new Array(octahedronCount).fill(null);

const Rocket: React.FC<{ buttonPressed: boolean }> = ({ buttonPressed }) => {
  const charRef: React.MutableRefObject<any> = useRef();
  const smokeRef: React.MutableRefObject<any> = useRef();

  // const axis = useRef(new THREE.Vector3());
  // const tangent = useRef(new THREE.Vector3());
  // const normal = new THREE.Vector3(0, 1, 0); // up

  const clearSmoke = () => {
    smokeArr.forEach((_, i) => {
      tempObject.scale.setScalar(0);
      tempObject.visible = false;
      tempObject.updateMatrix();
      smokeRef.current.setMatrixAt(i, tempObject.matrix);
      smokeRef.current.instanceMatrix.needsUpdate = true;
    });
  };

  const { scene } = useLoader(GLTFLoader, RocketModel) as any;

  let fraction = 0;
  let smokeIndex = octahedronCount - 1;

  useFrame(() => {
    if (buttonPressed) {
      fraction += 0.001;

      if (fraction > 1) {
        fraction = 0;
        smokeIndex = octahedronCount;
        clearSmoke();
      }

      const positionOnCurve = curve.getPoint(fraction);

      if (smokeIndex > 0 && Math.floor(fraction * 1000) % 5 === 0) {
        // position and scale the octahedrons (smoke clouds)
        tempObject.position.set(...positionOnCurve.clone().toArray());
        tempObject.translateX(Math.random() / 5 - 0.1);
        tempObject.translateY(-0.125);
        tempObject.translateZ(Math.random() / 5 - 0.1);
        tempObject.scale.setScalar(Math.random() / 20 - 0.025);
        tempObject.visible = true;
        tempObject.updateMatrix();
        smokeRef.current.setMatrixAt(smokeIndex, tempObject.matrix);
        smokeRef.current.instanceMatrix.needsUpdate = true;

        smokeIndex--;
      }

      charRef.current.rotation.z += 0.001;
      charRef.current.position.copy(positionOnCurve);
      // if (fraction + 0.001 < 1) {
      //   charRef?.current?.lookAt(curve.getPoint(fraction + 0.001));
      //   charRef?.current?.rotateX(-Math.PI / 4);
      // }

      // tangent.current = curve.getTangent(fraction);
      // axis.current.crossVectors(normal, tangent.current).normalize();

      // charRef?.current?.quaternion.setFromAxisAngle(axis.current, Math.PI / 2);
    } else {
      charRef?.current?.position.copy(curve.getPoint(0));
      fraction = 0;
      smokeIndex = octahedronCount;
      clearSmoke();
    }
  });

  return (
    <group>
      <Line
        points={points}
        color="#ff2060"
        lineWidth={1}
        dashed={false}
        alphaWrite={undefined}
      />

      {/* Smoke */}
      <instancedMesh ref={smokeRef} args={[undefined, undefined, 200]}>
        <octahedronGeometry args={[10, 3]} />
        <meshPhysicalMaterial color="#aaa" flatShading={true} />
      </instancedMesh>

      {/* Launchpad */}
      <Cylinder
        visible
        args={[0.3, 0.2, 0.1, 15]}
        position={[0.85, 0.5, 0.2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshPhysicalMaterial color="#555555" flatShading={true} />
      </Cylinder>

      <mesh visible ref={charRef}>
        <primitive
          object={scene}
          dispose={null}
          position={[0, 0, 0]}
          scale={[1.2, 1.2, 1.2]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </mesh>
    </group>
  );
};

export default Rocket;
