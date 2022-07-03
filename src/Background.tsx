import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Background = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const w = 400;
  const h = 400;
  canvas.width = w;
  canvas.height = h;

  const makeStars = (count: number) => {
    const out = [];
    for (let i = 0; i < count; i++) {
      const s = {
        x: Math.random() * 1600 - 800,
        y: Math.random() * 900 - 450,
        z: Math.random() * 1000,
      };
      out.push(s);
    }
    return out;
  };

  let stars = makeStars(5000);

  const clear = () => {
    if (ctx) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const putPixel = (x: number, y: number, brightness: number) => {
    const intensity = brightness * 255;
    const rgb = "rgb(" + intensity + "," + intensity + "," + intensity + ")";
    if (ctx) {
      ctx.fillStyle = rgb;
      ctx.fillRect(x, y, 1, 1);
    }
  };

  const moveStars = (distance: number) => {
    const count = stars.length;
    for (let i = 0; i < count; i++) {
      const s = stars[i];
      s.z -= distance;
      while (s.z <= 1) {
        s.z += 1000;
      }
    }
  };

  let prevTime: number;
  const init = (time: number) => {
    prevTime = time;
    requestAnimationFrame(tick);
  };

  const tick = (time: number) => {
    let elapsed = time - prevTime;
    prevTime = time;

    moveStars(elapsed * 0.1);

    clear();

    const cx = w / 2;
    const cy = h / 2;

    const count = stars.length;
    for (let i = 0; i < count; i++) {
      const star = stars[i];

      const x = cx + star.x / (star.z * 0.001);
      const y = cy + star.y / (star.z * 0.001);

      if (x < 0 || x >= w || y < 0 || y >= h) {
        continue;
      }

      const d = star.z / 1000.0;
      const b = 1 - d * d;

      putPixel(x, y, b);
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(init);

  const createCanvasTexture = () => {
    const texture = new THREE.Texture(canvas);

    return texture;
  };

  const texture = createCanvasTexture();

  const plane = new THREE.PlaneBufferGeometry(3, 2, 1);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });

  useFrame(() => {
    if (texture) texture.needsUpdate = true;
  });

  return <mesh visible geometry={plane} material={material} />;
};

export default Background;
