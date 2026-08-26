import { useEffect, useRef } from "react";
import * as THREE from "three";

import "./MembersWorkspace.css";

export const WORKSPACE_ROLES = ["engineering", "design", "experiment"] as const;
export type WorkspaceHair = "short" | "bob" | "ponytail" | "long";
export type WorkspaceOutfit = "trousers" | "skirt";
export type WorkspacePattern =
  | "stripes"
  | "badge"
  | "collar"
  | "checker"
  | "vest"
  | "flower"
  | "star";

export function getMembersWorkspaceConfig(
  viewportWidth: number,
  reducedMotion: boolean,
) {
  if (reducedMotion) {
    return {
      animate: false,
      maxFrameRate: 0,
      motionScale: 0,
      pixelRatioCap: 1,
      shadows: false,
    };
  }

  if (viewportWidth < 768) {
    return {
      animate: true,
      maxFrameRate: 30,
      motionScale: 0.55,
      pixelRatioCap: 1,
      shadows: false,
    };
  }

  return {
    animate: true,
    maxFrameRate: 60,
    motionScale: 1,
    pixelRatioCap: 1.5,
    shadows: true,
  };
}

type Worker = {
  arms: [THREE.Group, THREE.Group];
  body: THREE.Group;
  head: THREE.Mesh;
  role: (typeof WORKSPACE_ROLES)[number];
};

type WorkerPlan = {
  color: number;
  hair: WorkspaceHair;
  hairColor: number;
  identity: "indian-man" | "japanese-woman";
  outfit: WorkspaceOutfit;
  pattern: WorkspacePattern;
  role: Worker["role"];
  rotationY: number;
  seated: boolean;
  skin: number;
  x: number;
  z: number;
};

export function getMembersWorkspaceCameraConfig(viewportWidth: number) {
  if (viewportWidth < 768) {
    return {
      fov: 34,
      lookAtY: 1.15,
      lookAtZ: -0.3,
      x: 0,
      y: 5.7,
      z: 13.8,
    };
  }

  return {
    fov: 31,
    lookAtY: 1.25,
    lookAtZ: -0.3,
    x: 0,
    y: 4.6,
    z: 9.3,
  };
}

const palette = {
  aqua: 0x65d6d1,
  auburn: 0x9b4f32,
  black: 0x211d1b,
  brown: 0x7a4e2d,
  cream: 0xfffae8,
  dark: 0x25221f,
  deepSkin: 0x70452f,
  green: 0xa7d95b,
  lightSkin: 0xffd4a3,
  oliveSkin: 0xb9855b,
  pink: 0xff6fae,
  red: 0xf05c4f,
  sky: 0x6fc7ff,
  tanSkin: 0xd69a6b,
  warmSkin: 0xc97850,
  white: 0xffffff,
  yellow: 0xffd91a,
};

export function getMembersWorkspacePlan(viewportWidth = 1440) {
  void viewportWidth;
  return {
    laptop: { rotationY: Math.PI },
    stage: false,
    zones: ["desks", "meeting", "making", "conversation", "lounge"] as const,
    workers: [
      {
        color: palette.aqua,
        hair: "short",
        hairColor: palette.black,
        identity: "indian-man",
        outfit: "trousers",
        pattern: "stripes",
        role: "engineering",
        rotationY: 0,
        seated: true,
        skin: palette.deepSkin,
        x: -4.15,
        z: 0.9,
      },
      {
        color: palette.pink,
        hair: "long",
        hairColor: palette.black,
        identity: "japanese-woman",
        outfit: "skirt",
        pattern: "collar",
        role: "design",
        rotationY: 0,
        seated: true,
        skin: palette.lightSkin,
        x: 4.05,
        z: 0.15,
      },
    ] satisfies WorkerPlan[],
  };
}

function createWorkspaceResources() {
  const geometries = new Map<string, THREE.BufferGeometry>();
  const materials = new Map<string, THREE.Material>();

  const geometry = <T extends THREE.BufferGeometry>(
    key: string,
    create: () => T,
  ): T => {
    const existing = geometries.get(key);
    if (existing) return existing as T;

    const created = create();
    geometries.set(key, created);
    return created;
  };

  const material = (color: number, roughness = 0.55) => {
    const key = `standard:${color}:${roughness}`;
    const existing = materials.get(key);
    if (existing) return existing as THREE.MeshStandardMaterial;

    const created = new THREE.MeshStandardMaterial({ color, roughness });
    materials.set(key, created);
    return created;
  };

  const physicalMaterial = (color: number) => {
    const key = `physical:${color}`;
    const existing = materials.get(key);
    if (existing) return existing as THREE.MeshPhysicalMaterial;

    const created = new THREE.MeshPhysicalMaterial({
      color,
      opacity: 0.82,
      roughness: 0.2,
      transparent: true,
    });
    materials.set(key, created);
    return created;
  };

  const shadowMaterial = (opacity: number) => {
    const key = `shadow:${opacity}`;
    const existing = materials.get(key);
    if (existing) return existing as THREE.ShadowMaterial;

    const created = new THREE.ShadowMaterial({
      color: 0x9a731f,
      opacity,
      transparent: true,
    });
    materials.set(key, created);
    return created;
  };

  const boxGeometry = geometry(
    "box:unit",
    () => new THREE.BoxGeometry(1, 1, 1),
  );
  const box = (width: number, height: number, depth: number, color: number) => {
    const mesh = new THREE.Mesh(boxGeometry, material(color));
    mesh.scale.set(width, height, depth);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.workspaceBox = true;
    return mesh;
  };

  return {
    box,
    boxGeometry,
    dispose() {
      geometries.forEach((item) => {
        item.dispose();
      });
      materials.forEach((item) => {
        item.dispose();
      });
    },
    geometry,
    material,
    physicalMaterial,
    shadowMaterial,
  };
}

type WorkspaceResources = ReturnType<typeof createWorkspaceResources>;

function batchStaticBoxes(
  root: THREE.Group,
  dynamicRoots: THREE.Object3D[],
  resources: WorkspaceResources,
) {
  const dynamicObjects = new Set<THREE.Object3D>();
  dynamicRoots.forEach((dynamicRoot) => {
    dynamicRoot.traverse((object: THREE.Object3D) => {
      dynamicObjects.add(object);
    });
  });

  root.updateMatrixWorld(true);
  const rootInverse = root.matrixWorld.clone().invert();
  const boxesByMaterial = new Map<THREE.Material, THREE.Mesh[]>();

  root.traverse((object: THREE.Object3D) => {
    if (
      !(object instanceof THREE.Mesh) ||
      object.userData.workspaceBox !== true ||
      dynamicObjects.has(object) ||
      Array.isArray(object.material)
    ) {
      return;
    }

    const boxes = boxesByMaterial.get(object.material) ?? [];
    boxes.push(object);
    boxesByMaterial.set(object.material, boxes);
  });

  boxesByMaterial.forEach((boxes, boxMaterial) => {
    const instances = new THREE.InstancedMesh(
      resources.boxGeometry,
      boxMaterial,
      boxes.length,
    );
    instances.castShadow = true;
    instances.receiveShadow = true;
    instances.instanceMatrix.setUsage(THREE.StaticDrawUsage);

    boxes.forEach((item, index) => {
      instances.setMatrixAt(
        index,
        rootInverse.clone().multiply(item.matrixWorld),
      );
      item.removeFromParent();
    });

    instances.instanceMatrix.needsUpdate = true;
    instances.computeBoundingBox();
    instances.computeBoundingSphere();
    root.add(instances);
  });
}

function addClothingPattern(
  body: THREE.Group,
  pattern: WorkspacePattern,
  resources: WorkspaceResources,
) {
  const { box, geometry, material } = resources;
  const addFrontBox = (
    width: number,
    height: number,
    color: number,
    x: number,
    y: number,
    rotation = 0,
  ) => {
    const piece = box(width, height, 0.045, color);
    piece.position.set(x, y, 0.285);
    piece.rotation.z = rotation;
    body.add(piece);
  };

  if (pattern === "stripes") {
    for (const y of [1.35, 1.58, 1.81]) {
      addFrontBox(0.7, 0.1, palette.white, 0, y);
    }
  }

  if (pattern === "badge") {
    addFrontBox(0.28, 0.3, palette.white, 0.2, 1.55);
    const badge = new THREE.Mesh(
      geometry(
        "cylinder:badge",
        () => new THREE.CylinderGeometry(0.1, 0.1, 0.05, 20),
      ),
      material(palette.yellow),
    );
    badge.position.set(-0.2, 1.78, 0.31);
    badge.rotation.x = Math.PI / 2;
    body.add(badge);
  }

  if (pattern === "collar") {
    addFrontBox(0.32, 0.14, palette.white, -0.13, 1.94, -0.48);
    addFrontBox(0.32, 0.14, palette.white, 0.13, 1.94, 0.48);
    addFrontBox(0.12, 0.42, palette.yellow, 0, 1.67);
  }

  if (pattern === "checker") {
    [
      [-0.18, 1.72, palette.sky],
      [0.18, 1.72, palette.pink],
      [-0.18, 1.4, palette.pink],
      [0.18, 1.4, palette.sky],
    ].forEach(([x, y, color]) => {
      addFrontBox(0.28, 0.25, color, x, y);
    });
  }

  if (pattern === "vest") {
    addFrontBox(0.16, 0.8, palette.cream, -0.24, 1.55, -0.06);
    addFrontBox(0.16, 0.8, palette.cream, 0.24, 1.55, 0.06);
    addFrontBox(0.7, 0.1, palette.dark, 0, 1.18);
  }

  if (pattern === "flower") {
    const flowerMaterial = material(palette.pink);
    for (let index = 0; index < 5; index += 1) {
      const angle = (index / 5) * Math.PI * 2;
      const petal = new THREE.Mesh(
        geometry(
          "sphere:flower-petal",
          () => new THREE.SphereGeometry(0.1, 14, 10),
        ),
        flowerMaterial,
      );
      petal.scale.set(1.25, 0.75, 0.3);
      petal.position.set(
        Math.cos(angle) * 0.16,
        1.62 + Math.sin(angle) * 0.16,
        0.31,
      );
      body.add(petal);
    }
    const center = new THREE.Mesh(
      geometry(
        "sphere:flower-center",
        () => new THREE.SphereGeometry(0.09, 14, 10),
      ),
      material(palette.yellow),
    );
    center.position.set(0, 1.62, 0.33);
    body.add(center);
  }

  if (pattern === "star") {
    const starShape = new THREE.Shape();
    for (let index = 0; index < 10; index += 1) {
      const angle = -Math.PI / 2 + (index * Math.PI) / 5;
      const radius = index % 2 === 0 ? 0.27 : 0.12;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (index === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();
    const star = new THREE.Mesh(
      geometry("shape:star", () => new THREE.ShapeGeometry(starShape)),
      material(palette.yellow),
    );
    star.position.set(0, 1.62, 0.29);
    body.add(star);
  }
}

function createWorker(
  resources: WorkspaceResources,
  color: number,
  role: Worker["role"],
  hairStyle: WorkspaceHair,
  skin: number,
  hairColor: number,
  outfit: WorkspaceOutfit,
  pattern: WorkspacePattern,
  seated: boolean,
) {
  const { box, geometry, material } = resources;
  const body = new THREE.Group();
  const torso = box(0.82, 1.05, 0.52, color);
  torso.position.y = 1.55;
  body.add(torso);
  addClothingPattern(body, pattern, resources);

  const head = new THREE.Mesh(
    geometry(
      "cylinder:worker-head",
      () => new THREE.CylinderGeometry(0.34, 0.34, 0.5, 24),
    ),
    material(skin, 0.72),
  );
  head.position.y = 2.38;
  head.castShadow = true;
  body.add(head);

  const hair = new THREE.Mesh(
    geometry(
      "cylinder:worker-hair",
      () => new THREE.CylinderGeometry(0.35, 0.35, 0.16, 24),
    ),
    material(hairColor, 0.82),
  );
  hair.position.y = 2.62;
  body.add(hair);

  if (hairStyle === "bob" || hairStyle === "long") {
    const hairLength = hairStyle === "long" ? 0.76 : 0.48;
    const backHair = box(0.72, hairLength, 0.22, hairColor);
    backHair.position.set(0, hairStyle === "long" ? 2.25 : 2.36, -0.24);
    body.add(backHair);

    for (const x of [-0.3, 0.3]) {
      const sideHair = box(0.15, hairLength, 0.2, hairColor);
      sideHair.position.set(x, hairStyle === "long" ? 2.26 : 2.38, 0.08);
      body.add(sideHair);
    }
  }

  if (hairStyle === "ponytail") {
    const ponytail = new THREE.Mesh(
      geometry("sphere:ponytail", () => new THREE.SphereGeometry(0.24, 18, 12)),
      material(hairColor, 0.82),
    );
    ponytail.position.set(0.34, 2.47, -0.2);
    ponytail.castShadow = true;
    body.add(ponytail);
  }

  const eyeMaterial = material(palette.dark, 0.4);
  for (const x of [-0.12, 0.12]) {
    const eye = new THREE.Mesh(
      geometry(
        "sphere:worker-eye",
        () => new THREE.SphereGeometry(0.035, 12, 8),
      ),
      eyeMaterial,
    );
    eye.position.set(x, 2.42, 0.34);
    body.add(eye);
  }

  const smile = new THREE.Mesh(
    geometry(
      "torus:worker-smile",
      () => new THREE.TorusGeometry(0.095, 0.018, 8, 20, Math.PI),
    ),
    eyeMaterial,
  );
  smile.position.set(0, 2.29, 0.34);
  smile.rotation.z = Math.PI;
  body.add(smile);

  const arms: [THREE.Group, THREE.Group] = [
    new THREE.Group(),
    new THREE.Group(),
  ];
  arms.forEach((arm, index) => {
    const limb = box(0.22, 0.92, 0.22, color);
    limb.position.y = -0.42;
    arm.add(limb);
    arm.position.set(index === 0 ? -0.53 : 0.53, 1.98, 0);
    arm.rotation.z = index === 0 ? 0.08 : -0.08;
    body.add(arm);
  });

  if (outfit === "skirt") {
    const skirt = new THREE.Mesh(
      geometry(
        "cylinder:worker-skirt",
        () => new THREE.CylinderGeometry(0.42, 0.55, 0.62, 4),
      ),
      material(color),
    );
    skirt.position.y = 1.03;
    skirt.rotation.y = Math.PI / 4;
    skirt.castShadow = true;
    body.add(skirt);
    const skirtBand = box(0.68, 0.1, 0.06, palette.cream);
    skirtBand.position.set(0, 0.86, 0.39);
    body.add(skirtBand);
    for (const x of [-0.2, 0.2]) {
      const leg = box(0.18, seated ? 0.5 : 0.58, 0.25, skin);
      leg.position.set(x, seated ? 0.56 : 0.4, seated ? 0.25 : 0);
      leg.rotation.x = seated ? -Math.PI / 2 : 0;
      body.add(leg);
    }
  } else {
    for (const x of [-0.23, 0.23]) {
      const leg = box(0.32, seated ? 0.62 : 0.85, 0.36, color);
      leg.position.set(x, seated ? 0.72 : 0.55, seated ? 0.3 : 0);
      leg.rotation.x = seated ? -Math.PI / 2 : 0;
      body.add(leg);
    }
  }

  return { arms, body, head, role } satisfies Worker;
}

function createTable(
  resources: WorkspaceResources,
  width: number,
  color = palette.cream,
) {
  const { box } = resources;
  const table = new THREE.Group();
  const top = box(width, 0.16, 1.15, color);
  top.position.y = 1.15;
  table.add(top);
  for (const x of [-width / 2 + 0.18, width / 2 - 0.18]) {
    const leg = box(0.16, 1.12, 0.16, palette.white);
    leg.position.set(x, 0.55, 0);
    table.add(leg);
  }
  return table;
}

function createRoundTable(resources: WorkspaceResources) {
  const { geometry, material } = resources;
  const table = new THREE.Group();
  const top = new THREE.Mesh(
    geometry(
      "cylinder:round-table-top",
      () => new THREE.CylinderGeometry(1.25, 1.25, 0.16, 40),
    ),
    material(palette.cream),
  );
  top.position.y = 1.05;
  top.castShadow = true;
  top.receiveShadow = true;
  table.add(top);
  const leg = new THREE.Mesh(
    geometry(
      "cylinder:round-table-leg",
      () => new THREE.CylinderGeometry(0.18, 0.42, 1.02, 24),
    ),
    material(palette.white),
  );
  leg.position.y = 0.52;
  leg.castShadow = true;
  table.add(leg);
  return table;
}

function createChair(resources: WorkspaceResources, color: number) {
  const { box } = resources;
  const chair = new THREE.Group();
  const seat = box(0.68, 0.12, 0.68, color);
  seat.position.y = 0.55;
  chair.add(seat);
  const back = box(0.68, 0.72, 0.12, color);
  back.position.set(0, 0.9, -0.3);
  chair.add(back);
  for (const x of [-0.25, 0.25]) {
    for (const z of [-0.25, 0.25]) {
      const leg = box(0.08, 0.52, 0.08, palette.white);
      leg.position.set(x, 0.26, z);
      chair.add(leg);
    }
  }
  return chair;
}

function createPlant(resources: WorkspaceResources) {
  const { geometry, material } = resources;
  const plant = new THREE.Group();
  const pot = new THREE.Mesh(
    geometry(
      "cylinder:plant-pot",
      () => new THREE.CylinderGeometry(0.42, 0.3, 0.62, 20),
    ),
    material(palette.cream),
  );
  pot.position.y = 0.3;
  plant.add(pot);
  const stem = new THREE.Mesh(
    geometry(
      "cylinder:plant-stem",
      () => new THREE.CylinderGeometry(0.05, 0.07, 1.25, 12),
    ),
    material(0x5b9f52),
  );
  stem.position.y = 1.12;
  plant.add(stem);
  for (const [x, y, z] of [
    [-0.35, 1.25, 0],
    [0.35, 1.48, 0.05],
    [-0.12, 1.75, -0.04],
  ] as const) {
    const leaf = new THREE.Mesh(
      geometry(
        "sphere:plant-leaf",
        () => new THREE.SphereGeometry(0.36, 18, 12),
      ),
      material(palette.green),
    );
    leaf.scale.set(1.25, 0.62, 0.5);
    leaf.position.set(x, y, z);
    plant.add(leaf);
  }
  return plant;
}

function createShelf(resources: WorkspaceResources) {
  const { box } = resources;
  const shelf = new THREE.Group();
  for (const y of [0.18, 0.95, 1.72]) {
    const board = box(2.15, 0.12, 0.52, palette.white);
    board.position.y = y;
    shelf.add(board);
  }
  for (const x of [-1, 1]) {
    const side = box(0.12, 1.9, 0.52, palette.white);
    side.position.set(x, 0.95, 0);
    shelf.add(side);
  }
  [palette.pink, palette.sky, palette.green, palette.yellow].forEach(
    (color, index) => {
      const item = box(0.25, 0.45 + (index % 2) * 0.12, 0.28, color);
      item.position.set(-0.65 + index * 0.43, 1.97, 0.02);
      shelf.add(item);
    },
  );
  return shelf;
}

function createLaptop(resources: WorkspaceResources) {
  const { box } = resources;
  const laptop = new THREE.Group();
  const base = box(0.9, 0.08, 0.62, palette.dark);
  laptop.add(base);
  const screen = box(0.9, 0.62, 0.07, palette.dark);
  screen.position.set(0, 0.34, -0.28);
  screen.rotation.x = -0.12;
  laptop.add(screen);
  const glow = box(0.75, 0.46, 0.015, palette.sky);
  glow.position.set(0, 0.34, -0.235);
  glow.rotation.x = -0.12;
  laptop.add(glow);
  return laptop;
}

function createSofa(resources: WorkspaceResources, color: number) {
  const { box } = resources;
  const sofa = new THREE.Group();
  const seat = box(2.8, 0.42, 1.05, color);
  seat.position.y = 0.56;
  sofa.add(seat);
  const back = box(2.8, 1.05, 0.3, color);
  back.position.set(0, 1.05, -0.42);
  sofa.add(back);
  for (const x of [-1.28, 1.28]) {
    const arm = box(0.28, 0.72, 1.05, color);
    arm.position.set(x, 0.75, 0);
    sofa.add(arm);
  }
  for (const x of [-1.05, 1.05]) {
    const cushion = box(0.92, 0.16, 0.82, palette.cream);
    cushion.position.set(x, 0.84, 0.04);
    cushion.rotation.y = x < 0 ? -0.04 : 0.04;
    sofa.add(cushion);
  }
  return sofa;
}

export function MembersWorkspace({
  hint = "Tap to cheer",
  label = "オフィスで一緒に仕事をするインド人男性と日本人女性のブロック人形",
}: {
  hint?: string;
  label?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window.WebGLRenderingContext === "undefined") return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const config = getMembersWorkspaceConfig(window.innerWidth, reducedMotion);
    const resources = createWorkspaceResources();
    const { box, geometry, material } = resources;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffd83d);
    scene.fog = new THREE.Fog(0xffd83d, 18, 34);

    const initialCamera = getMembersWorkspaceCameraConfig(window.innerWidth);
    const camera = new THREE.PerspectiveCamera(initialCamera.fov, 1, 0.1, 45);
    camera.position.set(initialCamera.x, initialCamera.y, initialCamera.z);
    camera.lookAt(0, initialCamera.lookAtY, initialCamera.lookAtZ);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: window.innerWidth >= 768,
        canvas,
        powerPreference: "high-performance",
      });
    } catch {
      resources.dispose();
      return;
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = config.shadows;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const hemisphere = new THREE.HemisphereLight(0xffffff, 0xef9b28, 2.4);
    scene.add(hemisphere);
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(-5, 8, 7);
    keyLight.castShadow = config.shadows;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const workspace = new THREE.Group();
    scene.add(workspace);
    const plan = getMembersWorkspacePlan(window.innerWidth);
    const shadowFloor = new THREE.Mesh(
      geometry("plane:shadow-floor", () => new THREE.PlaneGeometry(34, 20)),
      resources.shadowMaterial(config.shadows ? 0.13 : 0),
    );
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = -0.02;
    shadowFloor.receiveShadow = config.shadows;
    workspace.add(shadowFloor);

    for (const [x, z] of [
      [-7.8, -3.2],
      [-3.25, -3.65],
      [3.25, -3.65],
      [7.8, -3.15],
    ] as const) {
      const divider = box(0.13, 2.2, 1.45, palette.white);
      divider.position.set(x, 1.05, z);
      workspace.add(divider);
    }

    const meetingRug = new THREE.Mesh(
      geometry(
        "cylinder:meeting-rug",
        () => new THREE.CylinderGeometry(2.65, 2.65, 0.08, 48),
      ),
      material(0xfff6cf),
    );
    meetingRug.position.set(0, 0.03, 0.25);
    meetingRug.receiveShadow = true;
    workspace.add(meetingRug);

    const whiteboard = box(3.75, 1.35, 0.1, palette.white);
    whiteboard.position.set(0, 2.05, -4.45);
    workspace.add(whiteboard);
    for (const x of [-1.62, 1.62]) {
      const whiteboardLeg = box(0.11, 1.7, 0.11, palette.white);
      whiteboardLeg.position.set(x, 0.86, -4.48);
      workspace.add(whiteboardLeg);
    }

    const shelf = createShelf(resources);
    shelf.position.set(6.1, 0, -4.15);
    workspace.add(shelf);

    for (const [x, z, scale] of [
      [-11.2, -2.6, 1.15],
      [-7.1, 3.25, 0.9],
      [4.2, 3.75, 0.82],
      [10.9, -2.8, 1.12],
    ] as const) {
      const plant = createPlant(resources);
      plant.position.set(x, 0, z);
      plant.scale.setScalar(scale);
      workspace.add(plant);
    }
    const workers = plan.workers.map((workerPlan) => {
      const worker = createWorker(
        resources,
        workerPlan.color,
        workerPlan.role,
        workerPlan.hair,
        workerPlan.skin,
        workerPlan.hairColor,
        workerPlan.outfit,
        workerPlan.pattern,
        workerPlan.seated,
      );
      worker.body.position.set(
        workerPlan.x,
        workerPlan.seated ? -0.28 : 0,
        workerPlan.z,
      );
      worker.body.rotation.y = workerPlan.rotationY;
      worker.body.scale.setScalar(window.innerWidth < 768 ? 0.92 : 0.96);
      if (workerPlan.seated) {
        const chair = createChair(resources, palette.cream);
        chair.position.set(workerPlan.x, 0, workerPlan.z);
        chair.rotation.y = workerPlan.rotationY;
        chair.scale.setScalar(0.96);
        workspace.add(chair);
      }
      workspace.add(worker.body);
      return worker;
    });

    if (plan.zones.includes("desks")) {
      for (const desk of [
        { laptopX: [-9.45, -8.05], x: -8.75, z: -1.15 },
        { laptopX: [-4.15], x: -4.15, z: 1.85 },
      ]) {
        const engineerTable = createTable(resources, 3.45);
        engineerTable.position.set(desk.x, 0, desk.z);
        workspace.add(engineerTable);
        for (const x of desk.laptopX) {
          const laptop = createLaptop(resources);
          laptop.position.set(x, 1.27, desk.z - 0.05);
          laptop.rotation.y = plan.laptop.rotationY;
          workspace.add(laptop);
        }
      }
      const deskLamp = new THREE.Mesh(
        geometry(
          "sphere:desk-lamp",
          () => new THREE.SphereGeometry(0.22, 18, 12),
        ),
        material(palette.yellow),
      );
      deskLamp.position.set(-3.35, 1.62, 1.78);
      workspace.add(deskLamp);
    }

    const designCards: THREE.Mesh[] = [];
    if (plan.zones.includes("meeting")) {
      const meetingTable = createRoundTable(resources);
      meetingTable.position.set(0, 0, 0.35);
      workspace.add(meetingTable);
      [
        [-1.5, 0.1, -0.18],
        [0, -1.8, 0],
        [1.5, 0.1, 0.18],
      ].forEach(([x, z, rotation]) => {
        const chair = createChair(resources, palette.aqua);
        chair.position.set(x, 0, z);
        chair.rotation.y = rotation;
        workspace.add(chair);
      });
      [
        palette.sky,
        palette.green,
        palette.pink,
        palette.yellow,
        palette.aqua,
        palette.red,
      ].forEach((color, index) => {
        const card = box(0.48, 0.34, 0.06, color);
        card.position.set(
          -1.2 + (index % 3) * 1.2,
          1.82 + Math.floor(index / 3) * 0.48,
          -4.36,
        );
        workspace.add(card);
        designCards.push(card);
      });
    }

    const tubes: THREE.Mesh[] = [];
    if (plan.zones.includes("making")) {
      const labTable = createTable(resources, 3.8);
      labTable.position.set(5.25, 0, 1.15);
      workspace.add(labTable);
      const designLaptop = createLaptop(resources);
      designLaptop.position.set(4.05, 1.27, 1.08);
      designLaptop.rotation.y = plan.laptop.rotationY;
      workspace.add(designLaptop);
      [palette.pink, palette.sky, palette.green, palette.yellow].forEach(
        (color, index) => {
          const tube = new THREE.Mesh(
            geometry(
              "cylinder:experiment-tube",
              () => new THREE.CylinderGeometry(0.13, 0.13, 0.68, 18),
            ),
            resources.physicalMaterial(color),
          );
          tube.position.set(5.15 + index * 0.32, 1.54, 1.12);
          tube.rotation.z = index === 1 ? 0.08 : -0.08;
          workspace.add(tube);
          tubes.push(tube);
        },
      );
      const prototype = box(0.7, 0.42, 0.7, palette.white);
      prototype.position.set(6.68, 1.45, 1.08);
      prototype.rotation.y = 0.35;
      workspace.add(prototype);
    }

    if (plan.zones.includes("conversation")) {
      const conversationSofa = createSofa(resources, palette.sky);
      conversationSofa.position.set(-10.4, 0, 2.15);
      conversationSofa.rotation.y = 0.08;
      workspace.add(conversationSofa);
      const conversationTable = new THREE.Mesh(
        geometry(
          "cylinder:conversation-table",
          () => new THREE.CylinderGeometry(0.82, 0.82, 0.16, 32),
        ),
        material(palette.cream),
      );
      conversationTable.position.set(-8.2, 0.56, 2.65);
      conversationTable.castShadow = true;
      workspace.add(conversationTable);
    }

    if (plan.zones.includes("lounge")) {
      const loungeSofa = createSofa(resources, palette.pink);
      loungeSofa.position.set(10.55, 0, 2.25);
      loungeSofa.rotation.y = -0.08;
      workspace.add(loungeSofa);
      const loungeTable = new THREE.Mesh(
        geometry(
          "cylinder:lounge-table",
          () => new THREE.CylinderGeometry(0.72, 0.72, 0.16, 32),
        ),
        material(palette.cream),
      );
      loungeTable.position.set(8.25, 0.56, 2.75);
      loungeTable.castShadow = true;
      workspace.add(loungeTable);
    }

    batchStaticBoxes(
      workspace,
      [...workers.map((worker) => worker.body), ...designCards],
      resources,
    );

    const engineeringWorkers = workers.filter(
      (worker) => worker.role === "engineering",
    );
    const designWorkers = workers.filter((worker) => worker.role === "design");
    const experimentWorkers = workers.filter(
      (worker) => worker.role === "experiment",
    );
    const pointer = new THREE.Vector2();
    let celebrationUntil = 0;
    let frame = 0;
    let visible = true;
    let lastRenderedTime = 0;
    const frameInterval = 1000 / config.maxFrameRate;

    const resize = () => {
      const { height, width } = canvas.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, config.pixelRatioCap),
      );
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      const cameraConfig = getMembersWorkspaceCameraConfig(width);
      camera.fov = cameraConfig.fov;
      camera.updateProjectionMatrix();
      camera.position.x = cameraConfig.x;
      camera.position.y = cameraConfig.y;
      camera.position.z = cameraConfig.z;
      camera.lookAt(0, cameraConfig.lookAtY, cameraConfig.lookAtZ);
      renderer.render(scene, camera);
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    };
    const onPointerLeave = () => pointer.set(0, 0);
    const onPointerDown = () => {
      celebrationUntil = performance.now() + 1400;
    };

    const renderFrame = (time: number) => {
      if (
        config.maxFrameRate > 0 &&
        time - lastRenderedTime + 0.5 < frameInterval
      ) {
        if (visible && config.animate) {
          frame = requestAnimationFrame(renderFrame);
        }
        return;
      }

      lastRenderedTime = time;
      const elapsed = time / 1000;
      const motion = config.motionScale;
      const celebrating = time < celebrationUntil;

      workers.forEach((worker, index) => {
        const phase = elapsed * 2.2 + index * 1.9;
        worker.body.position.y =
          (Math.sin(phase) * 0.045 +
            (celebrating ? Math.abs(Math.sin(elapsed * 11)) * 0.26 : 0)) *
          motion;
        worker.head.rotation.y = Math.sin(phase * 0.7) * 0.16 * motion;
      });

      engineeringWorkers.forEach((worker, index) => {
        worker.arms[0].rotation.x =
          (-0.72 + Math.sin(elapsed * 7 + index) * 0.16) * motion;
        worker.arms[1].rotation.x =
          (-0.72 + Math.sin(elapsed * 7 + Math.PI + index) * 0.16) * motion;
      });
      designWorkers.forEach((worker, index) => {
        worker.arms[index % 2].rotation.x =
          (-0.45 + Math.sin(elapsed * 2.5 + index) * 0.4) * motion;
      });
      experimentWorkers.forEach((worker, index) => {
        worker.arms[index % 2].rotation.x =
          (-0.7 + Math.sin(elapsed * 3.2 + index) * 0.34) * motion;
      });

      designCards.forEach((card, index) => {
        card.rotation.z = Math.sin(elapsed * 1.8 + index) * 0.07 * motion;
      });
      tubes.forEach((tube, index) => {
        tube.position.y =
          1.54 + Math.sin(elapsed * 2.5 + index * 1.2) * 0.06 * motion;
      });

      if (celebrating) {
        workers.forEach((worker, index) => {
          const cheerAngle = 0.55 + (index % 4) * 0.08;
          worker.arms[0].rotation.z = cheerAngle;
          worker.arms[1].rotation.z = -cheerAngle;
        });
      } else {
        workers.forEach((worker) => {
          worker.arms[0].rotation.z = 0.08;
          worker.arms[1].rotation.z = -0.08;
        });
      }

      const cameraConfig = getMembersWorkspaceCameraConfig(window.innerWidth);
      const baseCameraX = cameraConfig.x;
      const baseCameraY = cameraConfig.y;
      camera.position.x +=
        (baseCameraX + pointer.x * 0.28 * motion - camera.position.x) * 0.04;
      camera.position.y +=
        (baseCameraY + pointer.y * 0.12 * motion - camera.position.y) * 0.04;
      camera.lookAt(0, cameraConfig.lookAtY, cameraConfig.lookAtZ);
      renderer.render(scene, camera);

      if (visible && config.animate) frame = requestAnimationFrame(renderFrame);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && config.animate && frame === 0) {
        lastRenderedTime = 0;
        frame = requestAnimationFrame(renderFrame);
      }
      if (!visible && frame !== 0) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    intersectionObserver.observe(canvas);

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointerdown", onPointerDown);
    resize();
    if (config.animate) frame = requestAnimationFrame(renderFrame);

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
      resources.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="members-workspace">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label}
        className="members-workspace-canvas"
      />
      <p className="members-workspace-hint">{hint}</p>
    </div>
  );
}

export default MembersWorkspace;
