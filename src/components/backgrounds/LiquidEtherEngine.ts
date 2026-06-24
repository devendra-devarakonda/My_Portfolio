import * as THREE from 'three';

// --- Shaders ---

const face_vert = `
  attribute vec3 position;
  uniform vec2 px;
  uniform vec2 boundarySpace;
  varying vec2 uv;
  precision highp float;
  void main(){
    vec3 pos = position;
    vec2 scale = 1.0 - boundarySpace * 2.0;
    pos.xy = pos.xy * scale;
    uv = vec2(0.5)+(pos.xy)*0.5;
    gl_Position = vec4(pos, 1.0);
  }
`;

const line_vert = `
  attribute vec3 position;
  uniform vec2 px;
  precision highp float;
  varying vec2 uv;
  void main(){
    vec3 pos = position;
    uv = 0.5 + pos.xy * 0.5;
    vec2 n = sign(pos.xy);
    pos.xy = abs(pos.xy) - px * 1.0;
    pos.xy *= n;
    gl_Position = vec4(pos, 1.0);
  }
`;

const mouse_vert = `
  precision highp float;
  attribute vec3 position;
  attribute vec2 uv;
  uniform vec2 center;
  uniform vec2 scale;
  uniform vec2 px;
  varying vec2 vUv;
  void main(){
    vec2 pos = position.xy * scale * 2.0 * px + center;
    vUv = uv;
    gl_Position = vec4(pos, 0.0, 1.0);
  }
`;

const advection_frag = `
  precision highp float;
  uniform sampler2D velocity;
  uniform float dt;
  uniform bool isBFECC;
  uniform vec2 fboSize;
  uniform vec2 px;
  varying vec2 uv;
  void main(){
    vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
    if(isBFECC == false){
        vec2 vel = texture2D(velocity, uv).xy;
        vec2 uv2 = uv - vel * dt * ratio;
        vec2 newVel = texture2D(velocity, uv2).xy;
        gl_FragColor = vec4(newVel, 0.0, 0.0);
    } else {
        vec2 spot_new = uv;
        vec2 vel_old = texture2D(velocity, uv).xy;
        vec2 spot_old = spot_new - vel_old * dt * ratio;
        vec2 vel_new1 = texture2D(velocity, spot_old).xy;
        vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;
        vec2 error = spot_new2 - spot_new;
        vec2 spot_new3 = spot_new - error / 2.0;
        vec2 vel_2 = texture2D(velocity, spot_new3).xy;
        vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio;
        vec2 newVel2 = texture2D(velocity, spot_old2).xy; 
        gl_FragColor = vec4(newVel2, 0.0, 0.0);
    }
  }
`;

const color_frag = `
  precision highp float;
  uniform sampler2D velocity;
  uniform sampler2D palette;
  uniform vec4 bgColor;
  varying vec2 uv;
  void main(){
    vec2 vel = texture2D(velocity, uv).xy;
    float lenv = clamp(length(vel)*1.8, 0.0, 1.0);
    vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb;
    vec3 outRGB = mix(bgColor.rgb, c, lenv);
    float outA = mix(bgColor.a, 1.0, pow(lenv, 0.9));
    gl_FragColor = vec4(outRGB, outA*1.4);
  }
`;

const divergence_frag = `
  precision highp float;
  uniform sampler2D velocity;
  uniform float dt;
  uniform vec2 px;
  varying vec2 uv;
  void main(){
    float x0 = texture2D(velocity, uv-vec2(px.x, 0.0)).x;
    float x1 = texture2D(velocity, uv+vec2(px.x, 0.0)).x;
    float y0 = texture2D(velocity, uv-vec2(0.0, px.y)).y;
    float y1 = texture2D(velocity, uv+vec2(0.0, px.y)).y;
    float divergence = (x1 - x0 + y1 - y0) / 2.0;
    gl_FragColor = vec4(divergence / dt);
  }
`;

const externalForce_frag = `
  precision highp float;
  uniform vec2 force;
  uniform vec2 center;
  uniform vec2 scale;
  uniform vec2 px;
  varying vec2 vUv;
  void main(){
    vec2 circle = (vUv - 0.5) * 2.0;
    float d = 1.0 - min(length(circle), 1.0);
    d *= d;
    gl_FragColor = vec4(force * d, 0.0, 1.0);
  }
`;

const poisson_frag = `
  precision highp float;
  uniform sampler2D pressure;
  uniform sampler2D divergence;
  uniform vec2 px;
  varying vec2 uv;
  void main(){
    float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r;
    float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r;
    float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r;
    float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r;
    float div = texture2D(divergence, uv).r;
    float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
    gl_FragColor = vec4(newP);
  }
`;

const pressure_frag = `
  precision highp float;
  uniform sampler2D pressure;
  uniform sampler2D velocity;
  uniform vec2 px;
  uniform float dt;
  varying vec2 uv;
  void main(){
    float step = 1.0;
    float p0 = texture2D(pressure, uv + vec2(px.x * step, 0.0)).r;
    float p1 = texture2D(pressure, uv - vec2(px.x * step, 0.0)).r;
    float p2 = texture2D(pressure, uv + vec2(0.0, px.y * step)).r;
    float p3 = texture2D(pressure, uv - vec2(0.0, px.y * step)).r;
    vec2 v = texture2D(velocity, uv).xy;
    vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
    v = v - gradP * dt;
    gl_FragColor = vec4(v, 0.0, 1.0);
  }
`;

const viscous_frag = `
  precision highp float;
  uniform sampler2D velocity;
  uniform sampler2D velocity_new;
  uniform float v;
  uniform vec2 px;
  uniform float dt;
  varying vec2 uv;
  void main(){
    vec2 old = texture2D(velocity, uv).xy;
    vec2 new0 = texture2D(velocity_new, uv + vec2(px.x * 2.0, 0.0)).xy;
    vec2 new1 = texture2D(velocity_new, uv - vec2(px.x * 2.0, 0.0)).xy;
    vec2 new2 = texture2D(velocity_new, uv + vec2(0.0, px.y * 2.0)).xy;
    vec2 new3 = texture2D(velocity_new, uv - vec2(0.0, px.y * 2.0)).xy;
    vec2 newv = 4.0 * old + v * dt * (new0 + new1 + new2 + new3);
    newv /= 4.0 * (1.0 + v * dt);
    gl_FragColor = vec4(newv, 0.0, 0.0);
  }
`;

// --- Interfaces & Options ---

export interface SimulationOptions {
  iterations_poisson: number;
  iterations_viscous: number;
  mouse_force: number;
  resolution: number;
  cursor_size: number;
  viscous: number;
  isBounce: boolean;
  dt: number;
  isViscous: boolean;
  BFECC: boolean;
}

export interface WebGLManagerProps {
  $wrapper: HTMLDivElement;
  autoDemo: boolean;
  autoSpeed: number;
  autoIntensity: number;
  takeoverDuration: number;
  autoResumeDelay: number;
  autoRampDuration: number;
  colors: string[];
  mouseForce: number;
  cursorSize: number;
  isViscous: boolean;
  viscous: number;
  iterationsViscous: number;
  iterationsPoisson: number;
  dt: number;
  BFECC: boolean;
  resolution: number;
  isBounce: boolean;
}

interface QualityProfile {
  resolution: number;
  iterationsPoisson: number;
  iterationsViscous: number;
  pixelRatio: number;
}

const QUALITY_PROFILES: QualityProfile[] = [
  { resolution: 0.25, iterationsPoisson: 6, iterationsViscous: 2, pixelRatio: 1.0 },   // Low
  { resolution: 0.35, iterationsPoisson: 8, iterationsViscous: 4, pixelRatio: 1.0 },   // Medium
  { resolution: 0.50, iterationsPoisson: 12, iterationsViscous: 6, pixelRatio: 1.25 }  // High
];

// --- WebGL Core Classes ---

export class CommonClass {
  width = 0;
  height = 0;
  aspect = 1;
  pixelRatio = 1;
  isMobile = false;
  breakpoint = 768;
  fboWidth: number | null = null;
  fboHeight: number | null = null;
  time = 0;
  delta = 0;
  container: HTMLElement | null = null;
  renderer: THREE.WebGLRenderer | null = null;
  clock: THREE.Clock | null = null;

  init(container: HTMLElement) {
    this.container = container;
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.resize();
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.autoClear = false;
    this.renderer.setClearColor(new THREE.Color(0x000000), 0);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';
    this.clock = new THREE.Clock();
    this.clock.start();
  }

  resize() {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    this.width = Math.max(1, Math.floor(rect.width));
    this.height = Math.max(1, Math.floor(rect.height));
    this.aspect = this.width / this.height;
    if (this.renderer) this.renderer.setSize(this.width, this.height, false);
  }

  update() {
    if (this.clock) {
      this.delta = this.clock.getDelta();
      this.time += this.delta;
    }
  }

  dispose() {
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    this.clock = null;
    this.container = null;
  }
}

export class MouseClass {
  mouseMoved = false;
  coords = new THREE.Vector2();
  coords_old = new THREE.Vector2();
  diff = new THREE.Vector2();
  timer: number | null = null;
  container: HTMLElement | null = null;
  docTarget: Document | null = null;
  listenerTarget: Window | null = null;
  isHoverInside = false;
  hasUserControl = false;
  isAutoActive = false;
  autoIntensity = 2.0;
  takeoverActive = false;
  takeoverStartTime = 0;
  takeoverDuration = 0.25;
  takeoverFrom = new THREE.Vector2();
  takeoverTo = new THREE.Vector2();
  onInteract: (() => void) | null = null;

  _onMouseMove = this.onDocumentMouseMove.bind(this);
  _onTouchStart = this.onDocumentTouchStart.bind(this);
  _onTouchMove = this.onDocumentTouchMove.bind(this);
  _onTouchEnd = this.onTouchEnd.bind(this);
  _onDocumentLeave = this.onDocumentLeave.bind(this);

  init(container: HTMLElement) {
    this.container = container;
    this.docTarget = container.ownerDocument || null;
    const defaultView =
      (this.docTarget && this.docTarget.defaultView) || (typeof window !== 'undefined' ? window : null);
    if (!defaultView) return;
    this.listenerTarget = defaultView;
    this.listenerTarget.addEventListener('mousemove', this._onMouseMove);
    this.listenerTarget.addEventListener('touchstart', this._onTouchStart, { passive: true });
    this.listenerTarget.addEventListener('touchmove', this._onTouchMove, { passive: true });
    this.listenerTarget.addEventListener('touchend', this._onTouchEnd);
    if (this.docTarget) {
      this.docTarget.addEventListener('mouseleave', this._onDocumentLeave);
    }
  }

  dispose() {
    if (this.listenerTarget) {
      this.listenerTarget.removeEventListener('mousemove', this._onMouseMove);
      this.listenerTarget.removeEventListener('touchstart', this._onTouchStart);
      this.listenerTarget.removeEventListener('touchmove', this._onTouchMove);
      this.listenerTarget.removeEventListener('touchend', this._onTouchEnd);
    }
    if (this.docTarget) {
      this.docTarget.removeEventListener('mouseleave', this._onDocumentLeave);
    }
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
    this.listenerTarget = null;
    this.docTarget = null;
    this.container = null;
  }

  isPointInside(clientX: number, clientY: number) {
    if (!this.container) return false;
    const rect = this.container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
  }

  updateHoverState(clientX: number, clientY: number) {
    this.isHoverInside = this.isPointInside(clientX, clientY);
    return this.isHoverInside;
  }

  setCoords(x: number, y: number) {
    if (!this.container) return;
    if (this.timer) window.clearTimeout(this.timer);
    const rect = this.container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const nx = (x - rect.left) / rect.width;
    const ny = (y - rect.top) / rect.height;
    this.coords.set(nx * 2 - 1, -(ny * 2 - 1));
    this.mouseMoved = true;
    this.timer = window.setTimeout(() => {
      this.mouseMoved = false;
    }, 100);
  }

  setNormalized(nx: number, ny: number) {
    this.coords.set(nx, ny);
    this.mouseMoved = true;
  }

  onDocumentMouseMove(event: MouseEvent) {
    if (!this.updateHoverState(event.clientX, event.clientY)) return;
    if (this.onInteract) this.onInteract();
    if (this.isAutoActive && !this.hasUserControl && !this.takeoverActive) {
      if (!this.container) return;
      const rect = this.container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = (event.clientY - rect.top) / rect.height;
      this.takeoverFrom.copy(this.coords);
      this.takeoverTo.set(nx * 2 - 1, -(ny * 2 - 1));
      this.takeoverStartTime = performance.now();
      this.takeoverActive = true;
      this.hasUserControl = true;
      this.isAutoActive = false;
      return;
    }
    this.setCoords(event.clientX, event.clientY);
    this.hasUserControl = true;
  }

  onDocumentTouchStart(event: TouchEvent) {
    if (event.touches.length !== 1) return;
    const t = event.touches[0];
    if (!this.updateHoverState(t.clientX, t.clientY)) return;
    if (this.onInteract) this.onInteract();
    this.setCoords(t.clientX, t.clientY);
    this.hasUserControl = true;
  }

  onDocumentTouchMove(event: TouchEvent) {
    if (event.touches.length !== 1) return;
    const t = event.touches[0];
    if (!this.updateHoverState(t.clientX, t.clientY)) return;
    if (this.onInteract) this.onInteract();
    this.setCoords(t.clientX, t.clientY);
  }

  onTouchEnd() {
    this.isHoverInside = false;
  }

  onDocumentLeave() {
    this.isHoverInside = false;
  }

  update() {
    if (this.takeoverActive) {
      const t = (performance.now() - this.takeoverStartTime) / (this.takeoverDuration * 1000);
      if (t >= 1) {
        this.takeoverActive = false;
        this.coords.copy(this.takeoverTo);
        this.coords_old.copy(this.coords);
        this.diff.set(0, 0);
      } else {
        const k = t * t * (3 - 2 * t);
        this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo, k);
      }
    }
    this.diff.subVectors(this.coords, this.coords_old);
    this.coords_old.copy(this.coords);
    if (this.coords_old.x === 0 && this.coords_old.y === 0) this.diff.set(0, 0);
    if (this.isAutoActive && !this.takeoverActive) this.diff.multiplyScalar(this.autoIntensity);
  }
}

export class AutoDriver {
  mouse: MouseClass;
  manager: WebGLManager;
  enabled: boolean;
  speed: number;
  resumeDelay: number;
  rampDurationMs: number;
  active = false;
  current = new THREE.Vector2(0, 0);
  target = new THREE.Vector2();
  lastTime = performance.now();
  activationTime = 0;
  margin = 0.2;
  _tmpDir = new THREE.Vector2();

  constructor(mouse: MouseClass, manager: WebGLManager, opts: {
    enabled: boolean;
    speed: number;
    resumeDelay: number;
    rampDuration: number;
  }) {
    this.mouse = mouse;
    this.manager = manager;
    this.enabled = opts.enabled;
    this.speed = opts.speed;
    this.resumeDelay = opts.resumeDelay;
    this.rampDurationMs = opts.rampDuration * 1000;
    this.pickNewTarget();
  }

  pickNewTarget() {
    const r = Math.random;
    this.target.set((r() * 2 - 1) * (1 - this.margin), (r() * 2 - 1) * (1 - this.margin));
  }

  forceStop() {
    this.active = false;
    this.mouse.isAutoActive = false;
  }

  update() {
    if (!this.enabled) return;
    const now = performance.now();
    const idle = now - this.manager.lastUserInteraction;
    if (idle < this.resumeDelay) {
      if (this.active) this.forceStop();
      return;
    }
    if (this.mouse.isHoverInside) {
      if (this.active) this.forceStop();
      return;
    }
    if (!this.active) {
      this.active = true;
      this.current.copy(this.mouse.coords);
      this.lastTime = now;
      this.activationTime = now;
    }
    if (!this.active) return;
    this.mouse.isAutoActive = true;
    let dtSec = (now - this.lastTime) / 1000;
    this.lastTime = now;
    if (dtSec > 0.2) dtSec = 0.016;
    const dir = this._tmpDir.subVectors(this.target, this.current);
    const dist = dir.length();
    if (dist < 0.01) {
      this.pickNewTarget();
      return;
    }
    dir.normalize();
    let ramp = 1;
    if (this.rampDurationMs > 0) {
      const t = Math.min(1, (now - this.activationTime) / this.rampDurationMs);
      ramp = t * t * (3 - 2 * t);
    }
    const step = this.speed * dtSec * ramp;
    const move = Math.min(step, dist);
    this.current.addScaledVector(dir, move);
    this.mouse.setNormalized(this.current.x, this.current.y);
  }
}

// --- Shader Pass Helpers ---

class ShaderPass {
  props: {
    material?: THREE.ShaderMaterialParameters;
    output?: THREE.WebGLRenderTarget | null;
    output0?: THREE.WebGLRenderTarget;
    output1?: THREE.WebGLRenderTarget;
  };
  uniforms: { [key: string]: THREE.IUniform } = {};
  scene: THREE.Scene | null = null;
  camera: THREE.Camera | null = null;
  material: THREE.RawShaderMaterial | null = null;
  geometry: THREE.PlaneGeometry | null = null;
  plane: THREE.Mesh | null = null;
  common: CommonClass;

  constructor(common: CommonClass, props: ShaderPass['props']) {
    this.common = common;
    this.props = props || {};
    if (props.material?.uniforms) {
      this.uniforms = props.material.uniforms;
    }
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.Camera();
    if (this.props.material) {
      this.material = new THREE.RawShaderMaterial(this.props.material);
      this.geometry = new THREE.PlaneGeometry(2.0, 2.0);
      this.plane = new THREE.Mesh(this.geometry, this.material);
      this.scene.add(this.plane);
    }
  }

  update() {
    if (this.common.renderer && this.scene && this.camera) {
      this.common.renderer.setRenderTarget(this.props.output || null);
      this.common.renderer.render(this.scene, this.camera);
      this.common.renderer.setRenderTarget(null);
    }
  }

  dispose() {
    if (this.plane) {
      this.scene?.remove(this.plane);
    }
    if (this.geometry) {
      this.geometry.dispose();
      this.geometry = null;
    }
    if (this.material) {
      this.material.dispose();
      this.material = null;
    }
    this.scene = null;
    this.camera = null;
  }
}

class Advection extends ShaderPass {
  line: THREE.LineSegments | null = null;
  lineGeometry: THREE.BufferGeometry | null = null;
  lineMaterial: THREE.RawShaderMaterial | null = null;

  constructor(common: CommonClass, simProps: {
    cellScale: THREE.Vector2;
    fboSize: THREE.Vector2;
    dt: number;
    src: THREE.WebGLRenderTarget;
    dst: THREE.WebGLRenderTarget;
  }) {
    super(common, {
      material: {
        vertexShader: face_vert,
        fragmentShader: advection_frag,
        uniforms: {
          boundarySpace: { value: new THREE.Vector2().copy(simProps.cellScale) },
          px: { value: simProps.cellScale },
          fboSize: { value: simProps.fboSize },
          velocity: { value: simProps.src.texture },
          dt: { value: simProps.dt },
          isBFECC: { value: true }
        }
      },
      output: simProps.dst
    });
    this.init();
  }

  override init() {
    super.init();
    this.createBoundary();
  }

  createBoundary() {
    this.lineGeometry = new THREE.BufferGeometry();
    const vertices_boundary = new Float32Array([
      -1, -1, 0, -1, 1, 0, -1, 1, 0, 1, 1, 0, 1, 1, 0, 1, -1, 0, 1, -1, 0, -1, -1, 0
    ]);
    this.lineGeometry.setAttribute('position', new THREE.BufferAttribute(vertices_boundary, 3));
    this.lineMaterial = new THREE.RawShaderMaterial({
      vertexShader: line_vert,
      fragmentShader: advection_frag,
      uniforms: this.uniforms
    });
    this.line = new THREE.LineSegments(this.lineGeometry, this.lineMaterial);
    if (this.scene) this.scene.add(this.line);
  }

  updateAdvection(dt: number, isBounce: boolean, BFECC: boolean) {
    this.uniforms.dt.value = dt;
    if (this.line) this.line.visible = isBounce;
    this.uniforms.isBFECC.value = BFECC;
    super.update();
  }

  override dispose() {
    if (this.line && this.scene) {
      this.scene.remove(this.line);
    }
    if (this.lineGeometry) {
      this.lineGeometry.dispose();
      this.lineGeometry = null;
    }
    if (this.lineMaterial) {
      this.lineMaterial.dispose();
      this.lineMaterial = null;
    }
    super.dispose();
  }
}

class ExternalForce extends ShaderPass {
  mouseMesh: THREE.Mesh | null = null;
  mouseGeometry: THREE.PlaneGeometry | null = null;
  mouseMaterial: THREE.RawShaderMaterial | null = null;
  mouse: MouseClass;

  constructor(common: CommonClass, mouse: MouseClass, simProps: {
    cellScale: THREE.Vector2;
    cursor_size: number;
    dst: THREE.WebGLRenderTarget;
  }) {
    super(common, { output: simProps.dst });
    this.mouse = mouse;
    this.initForce(simProps);
  }

  initForce(simProps: { cellScale: THREE.Vector2; cursor_size: number }) {
    super.init();
    this.mouseGeometry = new THREE.PlaneGeometry(1, 1);
    this.mouseMaterial = new THREE.RawShaderMaterial({
      vertexShader: mouse_vert,
      fragmentShader: externalForce_frag,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        px: { value: simProps.cellScale },
        force: { value: new THREE.Vector2(0.0, 0.0) },
        center: { value: new THREE.Vector2(0.0, 0.0) },
        scale: { value: new THREE.Vector2(simProps.cursor_size, simProps.cursor_size) }
      }
    });
    this.mouseMesh = new THREE.Mesh(this.mouseGeometry, this.mouseMaterial);
    if (this.scene) this.scene.add(this.mouseMesh);
  }

  updateForce(props: {
    mouse_force: number;
    cursor_size: number;
    cellScale: THREE.Vector2;
  }) {
    // Scroll-gated interaction safeguard:
    // If scroll position is in the Hero section, ignore user pointer injection
    const isBelowHero = typeof window !== 'undefined' ? window.scrollY >= window.innerHeight : false;

    const forceX = isBelowHero ? (this.mouse.diff.x / 2) * props.mouse_force : 0;
    const forceY = isBelowHero ? (this.mouse.diff.y / 2) * props.mouse_force : 0;

    const cursorSizeX = props.cursor_size * props.cellScale.x;
    const cursorSizeY = props.cursor_size * props.cellScale.y;
    const centerX = Math.min(
      Math.max(this.mouse.coords.x, -1 + cursorSizeX + props.cellScale.x * 2),
      1 - cursorSizeX - props.cellScale.x * 2
    );
    const centerY = Math.min(
      Math.max(this.mouse.coords.y, -1 + cursorSizeY + props.cellScale.y * 2),
      1 - cursorSizeY - props.cellScale.y * 2
    );

    if (this.mouseMaterial) {
      const uniforms = this.mouseMaterial.uniforms;
      uniforms.force.value.set(forceX, forceY);
      uniforms.center.value.set(centerX, centerY);
      uniforms.scale.value.set(props.cursor_size, props.cursor_size);
    }
    super.update();
  }

  override dispose() {
    if (this.mouseMesh && this.scene) {
      this.scene.remove(this.mouseMesh);
    }
    if (this.mouseGeometry) {
      this.mouseGeometry.dispose();
      this.mouseGeometry = null;
    }
    if (this.mouseMaterial) {
      this.mouseMaterial.dispose();
      this.mouseMaterial = null;
    }
    super.dispose();
  }
}

class Viscous extends ShaderPass {
  constructor(common: CommonClass, simProps: {
    boundarySpace: THREE.Vector2;
    src: THREE.WebGLRenderTarget;
    dst_: THREE.WebGLRenderTarget;
    viscous: number;
    cellScale: THREE.Vector2;
    dt: number;
    dst: THREE.WebGLRenderTarget;
  }) {
    super(common, {
      material: {
        vertexShader: face_vert,
        fragmentShader: viscous_frag,
        uniforms: {
          boundarySpace: { value: simProps.boundarySpace },
          velocity: { value: simProps.src.texture },
          velocity_new: { value: simProps.dst_.texture },
          v: { value: simProps.viscous },
          px: { value: simProps.cellScale },
          dt: { value: simProps.dt }
        }
      },
      output: simProps.dst,
      output0: simProps.dst_,
      output1: simProps.dst
    });
    this.init();
  }

  updateViscous(viscous: number, iterations: number, dt: number): THREE.WebGLRenderTarget {
    let fbo_in: THREE.WebGLRenderTarget;
    let fbo_out = this.props.output1!;
    this.uniforms.v.value = viscous;
    for (let i = 0; i < iterations; i++) {
      if (i % 2 === 0) {
        fbo_in = this.props.output0!;
        fbo_out = this.props.output1!;
      } else {
        fbo_in = this.props.output1!;
        fbo_out = this.props.output0!;
      }
      this.uniforms.velocity_new.value = fbo_in.texture;
      this.props.output = fbo_out;
      this.uniforms.dt.value = dt;
      super.update();
    }
    return fbo_out;
  }
}

class Divergence extends ShaderPass {
  constructor(common: CommonClass, simProps: {
    boundarySpace: THREE.Vector2;
    src: THREE.WebGLRenderTarget;
    cellScale: THREE.Vector2;
    dt: number;
    dst: THREE.WebGLRenderTarget;
  }) {
    super(common, {
      material: {
        vertexShader: face_vert,
        fragmentShader: divergence_frag,
        uniforms: {
          boundarySpace: { value: simProps.boundarySpace },
          velocity: { value: simProps.src.texture },
          px: { value: simProps.cellScale },
          dt: { value: simProps.dt }
        }
      },
      output: simProps.dst
    });
    this.init();
  }

  updateDivergence(vel: THREE.WebGLRenderTarget) {
    this.uniforms.velocity.value = vel.texture;
    super.update();
  }
}

class Poisson extends ShaderPass {
  constructor(common: CommonClass, simProps: {
    boundarySpace: THREE.Vector2;
    dst_: THREE.WebGLRenderTarget;
    src: THREE.WebGLRenderTarget;
    cellScale: THREE.Vector2;
    dst: THREE.WebGLRenderTarget;
  }) {
    super(common, {
      material: {
        vertexShader: face_vert,
        fragmentShader: poisson_frag,
        uniforms: {
          boundarySpace: { value: simProps.boundarySpace },
          pressure: { value: simProps.dst_.texture },
          divergence: { value: simProps.src.texture },
          px: { value: simProps.cellScale }
        }
      },
      output: simProps.dst,
      output0: simProps.dst_,
      output1: simProps.dst
    });
    this.init();
  }

  updatePoisson(iterations: number): THREE.WebGLRenderTarget {
    let p_in: THREE.WebGLRenderTarget;
    let p_out = this.props.output1!;
    for (let i = 0; i < iterations; i++) {
      if (i % 2 === 0) {
        p_in = this.props.output0!;
        p_out = this.props.output1!;
      } else {
        p_in = this.props.output1!;
        p_out = this.props.output0!;
      }
      this.uniforms.pressure.value = p_in.texture;
      this.props.output = p_out;
      super.update();
    }
    return p_out;
  }
}

class PressurePass extends ShaderPass {
  constructor(common: CommonClass, simProps: {
    boundarySpace: THREE.Vector2;
    src_p: THREE.WebGLRenderTarget;
    src_v: THREE.WebGLRenderTarget;
    cellScale: THREE.Vector2;
    dt: number;
    dst: THREE.WebGLRenderTarget;
  }) {
    super(common, {
      material: {
        vertexShader: face_vert,
        fragmentShader: pressure_frag,
        uniforms: {
          boundarySpace: { value: simProps.boundarySpace },
          pressure: { value: simProps.src_p.texture },
          velocity: { value: simProps.src_v.texture },
          px: { value: simProps.cellScale },
          dt: { value: simProps.dt }
        }
      },
      output: simProps.dst
    });
    this.init();
  }

  updatePressure(vel: THREE.WebGLRenderTarget, pressure: THREE.WebGLRenderTarget) {
    this.uniforms.velocity.value = vel.texture;
    this.uniforms.pressure.value = pressure.texture;
    super.update();
  }
}

// --- Simulation Manager ---

export class Simulation {
  options: SimulationOptions;
  fbos: {
    vel_0: THREE.WebGLRenderTarget | null;
    vel_1: THREE.WebGLRenderTarget | null;
    vel_viscous0: THREE.WebGLRenderTarget | null;
    vel_viscous1: THREE.WebGLRenderTarget | null;
    div: THREE.WebGLRenderTarget | null;
    pressure_0: THREE.WebGLRenderTarget | null;
    pressure_1: THREE.WebGLRenderTarget | null;
  };
  fboSize = new THREE.Vector2();
  cellScale = new THREE.Vector2();
  boundarySpace = new THREE.Vector2();

  advection: Advection | null = null;
  externalForce: ExternalForce | null = null;
  viscous: Viscous | null = null;
  divergence: Divergence | null = null;
  poisson: Poisson | null = null;
  pressure: PressurePass | null = null;

  common: CommonClass;
  mouse: MouseClass;

  constructor(common: CommonClass, mouse: MouseClass, options: Partial<SimulationOptions>) {
    this.common = common;
    this.mouse = mouse;
    this.options = {
      iterations_poisson: 32,
      iterations_viscous: 32,
      mouse_force: 20,
      resolution: 0.7, // Matches starting quality profile
      cursor_size: 100,
      viscous: 30,
      isBounce: false,
      dt: 0.014,
      isViscous: false,
      BFECC: true,
      ...options
    };
    this.fbos = {
      vel_0: null,
      vel_1: null,
      vel_viscous0: null,
      vel_viscous1: null,
      div: null,
      pressure_0: null,
      pressure_1: null
    };
    this.init();
  }

  init() {
    this.calcSize();
    this.createAllFBO();
    this.createShaderPasses();
  }

  getFloatType() {
    if (typeof navigator !== 'undefined') {
      const isIOS = /(iPad|iPhone|iPod)/i.test(navigator.userAgent);
      return isIOS ? THREE.HalfFloatType : THREE.FloatType;
    }
    return THREE.FloatType;
  }

  createAllFBO() {
    const type = this.getFloatType();
    const opts = {
      type,
      depthBuffer: false,
      stencilBuffer: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping
    };
    for (const key in this.fbos) {
      const fboKey = key as keyof typeof this.fbos;
      if (this.fbos[fboKey]) {
        this.fbos[fboKey]!.dispose();
      }
      this.fbos[fboKey] = new THREE.WebGLRenderTarget(this.fboSize.x, this.fboSize.y, opts);
    }
  }

  createShaderPasses() {
    this.advection = new Advection(this.common, {
      cellScale: this.cellScale,
      fboSize: this.fboSize,
      dt: this.options.dt,
      src: this.fbos.vel_0!,
      dst: this.fbos.vel_1!
    });
    this.externalForce = new ExternalForce(this.common, this.mouse, {
      cellScale: this.cellScale,
      cursor_size: this.options.cursor_size,
      dst: this.fbos.vel_1!
    });
    this.viscous = new Viscous(this.common, {
      cellScale: this.cellScale,
      boundarySpace: this.boundarySpace,
      viscous: this.options.viscous,
      src: this.fbos.vel_1!,
      dst: this.fbos.vel_viscous1!,
      dst_: this.fbos.vel_viscous0!,
      dt: this.options.dt
    });
    this.divergence = new Divergence(this.common, {
      cellScale: this.cellScale,
      boundarySpace: this.boundarySpace,
      src: this.fbos.vel_viscous0!,
      dst: this.fbos.div!,
      dt: this.options.dt
    });
    this.poisson = new Poisson(this.common, {
      cellScale: this.cellScale,
      boundarySpace: this.boundarySpace,
      src: this.fbos.div!,
      dst: this.fbos.pressure_1!,
      dst_: this.fbos.pressure_0!
    });
    this.pressure = new PressurePass(this.common, {
      cellScale: this.cellScale,
      boundarySpace: this.boundarySpace,
      src_p: this.fbos.pressure_0!,
      src_v: this.fbos.vel_viscous0!,
      dst: this.fbos.vel_0!,
      dt: this.options.dt
    });
  }

  calcSize() {
    const width = Math.max(1, Math.round(this.options.resolution * this.common.width));
    const height = Math.max(1, Math.round(this.options.resolution * this.common.height));
    const px_x = 1.0 / width;
    const px_y = 1.0 / height;
    this.cellScale.set(px_x, px_y);
    this.fboSize.set(width, height);
  }

  resize() {
    this.calcSize();
    for (const key in this.fbos) {
      const fboKey = key as keyof typeof this.fbos;
      if (this.fbos[fboKey]) {
        this.fbos[fboKey]!.setSize(this.fboSize.x, this.fboSize.y);
      }
    }
  }

  update() {
    if (this.options.isBounce) {
      this.boundarySpace.set(0, 0);
    } else {
      this.boundarySpace.copy(this.cellScale);
    }

    if (this.advection) {
      this.advection.updateAdvection(
        this.options.dt,
        this.options.isBounce,
        this.options.BFECC
      );
    }

    if (this.externalForce) {
      this.externalForce.updateForce({
        cursor_size: this.options.cursor_size,
        mouse_force: this.options.mouse_force,
        cellScale: this.cellScale
      });
    }

    let vel = this.fbos.vel_1!;
    if (this.options.isViscous && this.viscous) {
      vel = this.viscous.updateViscous(
        this.options.viscous,
        this.options.iterations_viscous,
        this.options.dt
      );
    }

    if (this.divergence) {
      this.divergence.updateDivergence(vel);
    }

    let pressure = this.fbos.pressure_0!;
    if (this.poisson) {
      pressure = this.poisson.updatePoisson(this.options.iterations_poisson);
    }

    if (this.pressure) {
      this.pressure.updatePressure(vel, pressure);
    }
  }

  dispose() {
    this.advection?.dispose();
    this.externalForce?.dispose();
    this.viscous?.dispose();
    this.divergence?.dispose();
    this.poisson?.dispose();
    this.pressure?.dispose();

    for (const key in this.fbos) {
      const fboKey = key as keyof typeof this.fbos;
      if (this.fbos[fboKey]) {
        this.fbos[fboKey]!.dispose();
        this.fbos[fboKey] = null;
      }
    }
  }
}

export class Output {
  simulation: Simulation;
  scene: THREE.Scene;
  camera: THREE.Camera;
  planeGeometry: THREE.PlaneGeometry | null = null;
  material: THREE.RawShaderMaterial | null = null;
  output: THREE.Mesh | null = null;
  common: CommonClass;

  constructor(common: CommonClass, mouse: MouseClass, paletteTex: THREE.DataTexture, bgVec4: THREE.Vector4, options: Partial<SimulationOptions>) {
    this.common = common;
    this.simulation = new Simulation(common, mouse, options);
    this.scene = new THREE.Scene();
    this.camera = new THREE.Camera();

    this.planeGeometry = new THREE.PlaneGeometry(2, 2);
    this.material = new THREE.RawShaderMaterial({
      vertexShader: face_vert,
      fragmentShader: color_frag,
      transparent: true,
      depthWrite: false,
      uniforms: {
        velocity: { value: this.simulation.fbos.vel_0!.texture },
        boundarySpace: { value: new THREE.Vector2() },
        palette: { value: paletteTex },
        bgColor: { value: bgVec4 }
      }
    });

    this.output = new THREE.Mesh(this.planeGeometry, this.material);
    this.scene.add(this.output);
  }

  resize() {
    this.simulation.resize();
  }

  render() {
    if (this.common.renderer) {
      this.common.renderer.setRenderTarget(null);
      this.common.renderer.render(this.scene, this.camera);
    }
  }

  update() {
    this.simulation.update();
    this.render();
  }

  dispose() {
    this.simulation.dispose();
    if (this.output) {
      this.scene.remove(this.output);
      this.output = null;
    }
    if (this.planeGeometry) {
      this.planeGeometry.dispose();
      this.planeGeometry = null;
    }
    if (this.material) {
      this.material.dispose();
      this.material = null;
    }
  }
}

// --- WebGL Main Orchestrator ---

export class WebGLManager {
  props: WebGLManagerProps;
  common: CommonClass;
  mouse: MouseClass;
  lastUserInteraction: number;
  autoDriver: AutoDriver | null = null;
  running = false;
  output: Output | null = null;
  paletteTex: THREE.DataTexture | null = null;
  rafId: number | null = null;

  // Adaptive Quality Variables
  qualityIndex = 1; // Start at Medium
  fpsFrames = 0;
  fpsLastTime = performance.now();
  qualityCooldown = 0; // Cooldown timer (in frames or ms)
  consecutiveHighFps = 0; // High FPS stability counter

  _loop = this.loop.bind(this);
  _resize = this.resize.bind(this);
  _onVisibility: () => void;

  constructor(props: WebGLManagerProps) {
    this.props = props;
    this.common = new CommonClass();
    this.mouse = new MouseClass();

    this.common.init(props.$wrapper);
    this.mouse.init(props.$wrapper);

    this.mouse.autoIntensity = props.autoIntensity;
    this.mouse.takeoverDuration = props.takeoverDuration;
    this.lastUserInteraction = performance.now();

    this.mouse.onInteract = () => {
      this.lastUserInteraction = performance.now();
      if (this.autoDriver) this.autoDriver.forceStop();
    };

    this.autoDriver = new AutoDriver(this.mouse, this, {
      enabled: props.autoDemo,
      speed: props.autoSpeed,
      resumeDelay: props.autoResumeDelay,
      rampDuration: props.autoRampDuration
    });

    this.initPalette();
    this.init();

    window.addEventListener('resize', this._resize);

    this._onVisibility = () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.start();
      }
    };
    document.addEventListener('visibilitychange', this._onVisibility);
  }

  initPalette() {
    let arr: string[];
    if (Array.isArray(this.props.colors) && this.props.colors.length > 0) {
      if (this.props.colors.length === 1) {
        arr = [this.props.colors[0], this.props.colors[0]];
      } else {
        arr = this.props.colors;
      }
    } else {
      arr = ['#ffffff', '#ffffff'];
    }

    const w = arr.length;
    const data = new Uint8Array(w * 4);
    for (let i = 0; i < w; i++) {
      const c = new THREE.Color(arr[i]);
      data[i * 4 + 0] = Math.round(c.r * 255);
      data[i * 4 + 1] = Math.round(c.g * 255);
      data[i * 4 + 2] = Math.round(c.b * 255);
      data[i * 4 + 3] = 255;
    }

    this.paletteTex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
    this.paletteTex.magFilter = THREE.LinearFilter;
    this.paletteTex.minFilter = THREE.LinearFilter;
    this.paletteTex.wrapS = THREE.ClampToEdgeWrapping;
    this.paletteTex.wrapT = THREE.ClampToEdgeWrapping;
    this.paletteTex.generateMipmaps = false;
    this.paletteTex.needsUpdate = true;
  }

  init() {
    if (this.common.renderer && this.paletteTex) {
      this.props.$wrapper.prepend(this.common.renderer.domElement);
      const bgVec4 = new THREE.Vector4(0, 0, 0, 0.4); // Always transparent canvas inside the overlay
      
      // Determine starting profile (Mobile users start directly at Low to avoid frame drop spikes)
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        typeof navigator !== 'undefined' ? navigator.userAgent : ''
      );
      this.qualityIndex = isMobileDevice ? 0 : 1;
      const initialProfile = QUALITY_PROFILES[this.qualityIndex];

      this.output = new Output(this.common, this.mouse, this.paletteTex, bgVec4, {
        iterations_poisson: initialProfile.iterationsPoisson,
        iterations_viscous: initialProfile.iterationsViscous,
        mouse_force: this.props.mouseForce,
        cursor_size: this.props.cursorSize,
        viscous: this.props.viscous,
        isBounce: this.props.isBounce,
        dt: this.props.dt,
        isViscous: this.props.isViscous,
        BFECC: this.props.BFECC,
        resolution: initialProfile.resolution
      });
      
      this.common.renderer.setPixelRatio(initialProfile.pixelRatio);
      this.common.resize();
      this.output.resize();
    }
  }

  resize() {
    this.common.resize();
    if (this.output) this.output.resize();
  }

  // --- Dynamic FPS Adaptation logic ---
  monitorPerformance() {
    this.fpsFrames++;
    const now = performance.now();
    const elapsed = now - this.fpsLastTime;

    // Check FPS every 1000ms (1 second)
    if (elapsed >= 1000) {
      const fps = (this.fpsFrames * 1000) / elapsed;
      
      this.fpsFrames = 0;
      this.fpsLastTime = now;

      if (this.qualityCooldown > 0) {
        this.qualityCooldown--;
        return;
      }

      // If FPS drops below 50: Downscale quality immediately
      if (fps < 50 && this.qualityIndex > 0) {
        this.qualityIndex--;
        this.applyQualityProfile();
        this.qualityCooldown = 4; // Prevent downscaling again for 4 seconds
        this.consecutiveHighFps = 0;
      } 
      // If FPS is stable above 55: Upgrade quality gradually
      else if (fps >= 55 && this.qualityIndex < QUALITY_PROFILES.length - 1) {
        this.consecutiveHighFps++;
        if (this.consecutiveHighFps >= 3) { // Require 3 stable seconds of 55+ FPS before upgrading
          this.qualityIndex++;
          this.applyQualityProfile();
          this.qualityCooldown = 4; // Prevent quality changes for 4 seconds
          this.consecutiveHighFps = 0;
        }
      } else {
        this.consecutiveHighFps = 0;
      }
    }
  }

  applyQualityProfile() {
    if (!this.output) return;
    const profile = QUALITY_PROFILES[this.qualityIndex];
    const sim = this.output.simulation;
    
    sim.options.resolution = profile.resolution;
    sim.options.iterations_poisson = profile.iterationsPoisson;
    sim.options.iterations_viscous = profile.iterationsViscous;

    if (this.common.renderer) {
      this.common.renderer.setPixelRatio(profile.pixelRatio);
    }
    
    this.resize();
  }

  render() {
    this.monitorPerformance();
    if (this.autoDriver) this.autoDriver.update();
    this.mouse.update();
    this.common.update();
    if (this.output) this.output.update();
  }

  loop() {
    if (!this.running) return;
    this.render();
    this.rafId = requestAnimationFrame(this._loop);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.fpsLastTime = performance.now();
    this.fpsFrames = 0;
    this._loop();
  }

  pause() {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  dispose() {
    try {
      window.removeEventListener('resize', this._resize);
      document.removeEventListener('visibilitychange', this._onVisibility);
      this.pause();
      this.mouse.dispose();
      this.autoDriver = null;
      if (this.output) {
        this.output.dispose();
        this.output = null;
      }
      if (this.paletteTex) {
        this.paletteTex.dispose();
        this.paletteTex = null;
      }
      this.common.dispose();
    } catch {
      void 0;
    }
  }
}
