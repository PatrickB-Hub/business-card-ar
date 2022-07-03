import { render } from "react-dom";
import React, { useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import {
  ZapparCamera,
  ImageTracker,
  ZapparCanvas,
  BrowserCompatibility,
} from "@zappar/zappar-react-three-fiber";

import LaunchButtonModel from "./assets/button.glb";
import targetFile from "./assets/Business-Card.zpt";
import rocketLaunchSound from "./assets/spacecraft-launch.mp3";
import webIconTextureImg from "./assets/WebLaunch.png";
import facebookIconTextureImg from "./assets/Facebook.png";
import phoneIconTextureImg from "./assets/Phone.png";

import Background from "./Background";
import Rocket from "./Rocket";

// Icons
const Icons = () => {
  const webIconTexture = useLoader(
    THREE.TextureLoader,
    webIconTextureImg
  ) as THREE.Texture;
  const facebookIconTexture = useLoader(
    THREE.TextureLoader,
    facebookIconTextureImg
  ) as THREE.Texture;
  const phoneIconTexture = useLoader(
    THREE.TextureLoader,
    phoneIconTextureImg
  ) as THREE.Texture;

  return (
    <group>
      <mesh
        position={[-1.1, 0.65, 0.3]}
        onClick={() => window.open("https://patrickbecker.me")}
      >
        <planeBufferGeometry args={[0.38, 0.38]} />
        <meshBasicMaterial
          attach="material"
          map={webIconTexture}
          color="white"
          transparent
        />
      </mesh>
      <mesh
        position={[-0.65, 0.65, 0.3]}
        onClick={() => window.open("mailto:kontakt@patrickbecker.me")}
      >
        <planeBufferGeometry args={[0.38, 0.38]} />
        <meshBasicMaterial
          attach="material"
          map={facebookIconTexture}
          color="white"
          transparent
        />
      </mesh>
      <mesh
        position={[-0.2, 0.65, 0.3]}
        onClick={() => window.open("tel:015737249823")}
      >
        <planeBufferGeometry args={[0.38, 0.38]} />
        <meshBasicMaterial
          attach="material"
          map={phoneIconTexture}
          color="white"
          transparent
        />
      </mesh>
    </group>
  );
};

// Name and Title
const Nametitle = () => {
  return (
    <group>
      <mesh>
        <Text
          font={"/strat-regular.ttf"}
          color="white"
          position={[-0.91, 0.1, 0.1]}
          fontSize={0.13}
        >
          Patrick Becker
        </Text>
        <Text
          font={"/strat-regular.ttf"}
          color="white"
          position={[-0.89, -0.033, 0.1]}
          fontSize={0.1}
        >
          Software Developer
        </Text>
      </mesh>
    </group>
  );
};

// Call To Action
const Cta = () => {
  return (
    <mesh>
      <Text
        color="white"
        position={[-0.86, -0.65, 0.1]}
        font={"/strat-regular.ttf"}
        fontSize={0.1}
        maxWidth={0.8}
        textAlign="center"
      >
        Tap on an icon to find out more!
      </Text>
    </mesh>
  );
};

// Sound
const Sound = () => {
  const listener = new THREE.AudioListener();
  const ZapLaser = new THREE.Audio(listener);

  const audioLoader = new THREE.AudioLoader();
  audioLoader.load(rocketLaunchSound, (buffer) => {
    ZapLaser.setBuffer(buffer);
    ZapLaser.setLoop(false);
    ZapLaser.play();
  });
};

// Button
const LaunchButton: React.FC<{
  setPressed: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setPressed }) => {
  const { scene } = useLoader(GLTFLoader, LaunchButtonModel) as any;
  const buttonRef: React.MutableRefObject<any> = useRef();
  // Return the model as a primitive
  return (
    <mesh
      ref={buttonRef}
      visible
      onClick={(e) => {
        e.stopPropagation();
        setPressed((p) => !p);
        Sound();
      }}
    >
      <primitive
        object={scene}
        dispose={null}
        position={[0.85, -0.5, 0.3]}
        scale={[0.75, 0.75, 0.75]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </mesh>
  );
};

const App = () => {
  // Set up states
  const [visibleState, setVisibleState] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <>
      <BrowserCompatibility />
      {/* Setup Zappar Canvas */}
      <ZapparCanvas gl={{ antialias: true }}>
        {/* Setup Zappar Camera */}
        <ZapparCamera />
        {/* Setup Zappar Image Tracker, passing our target file */}
        <Suspense fallback={null}>
          <ImageTracker
            onNotVisible={() => {
              setVisibleState(false);
            }}
            onNewAnchor={(anchor) => console.log(`New anchor ${anchor.id}`)}
            onVisible={() => {
              setVisibleState(true);
            }}
            targetImage={targetFile}
            visible={visibleState}
          >
            {/* Setup Content */}
            <Icons />
            <Nametitle />
            <Rocket buttonPressed={pressed} />
            <LaunchButton setPressed={setPressed} />
            {/* <Model /> */}
            <Cta />
            <Background />
            {/* <Background /> */}
          </ImageTracker>
        </Suspense>
        {/* Ambient directional light */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[2.5, 8, 5]} intensity={1.5} castShadow />
      </ZapparCanvas>
    </>
  );
};

render(<App />, document.getElementById("root"));

export default App;
