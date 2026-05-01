const __MYWALLPAPER_WIDGET_RUNTIME_CONTRACT__ = "1";
if (!__canvasRuntime) {
      throw new Error('Canvas runtime globals are unavailable');
    }
if (!__canvasRuntime.react || !__canvasRuntime.reactJsxRuntime || !__canvasRuntime.sdkReact || !__canvasRuntime.sdkContracts || !__canvasRuntime.sdkPermissions) {
      throw new Error('Canvas runtime globals are unavailable');
    }
const __canvasRuntimeReact = __canvasRuntime.react;
const __canvasRuntimeJsxRuntime = __canvasRuntime.reactJsxRuntime;
const __canvasRuntimeSdk = __canvasRuntime.sdkReact;
const __canvasRuntimeSdkContracts = __canvasRuntime.sdkContracts;
const __canvasRuntimeSdkPermissions = __canvasRuntime.sdkPermissions;
const de = __canvasRuntimeJsxRuntime.jsx;
const ce = __canvasRuntimeReact.useRef;
const ge = __canvasRuntimeReact.useState;
const me = __canvasRuntimeReact.useEffect;
const we = __canvasRuntimeSdk.useSettings;
const ye = __canvasRuntimeSdk.useViewport;
const o = {
  rainColor: "#a8c8e8",
  rainIntensity: 200,
  rainSpeed: 1.7,
  dropLength: 42,
  dropWidth: 0.8,
  windAngle: -5,
  windVariation: 0,
  enableGlow: !0,
  glowIntensity: 0.3,
  opacity: 0.6
}, D = (
  /* wgsl */
  "struct Particle { x: f32, y: f32, sx: f32, sy: f32, dx: f32, dy: f32, len: f32, _p: f32 };"
), pe = (
  /* wgsl */
  `
fn hash(s: u32) -> u32 { var v=s; v^=v>>16u; v*=0x45d9f3bu; v^=v>>16u; v*=0x45d9f3bu; v^=v>>16u; return v; }
fn rng(s: ptr<function,u32>) -> f32 { *s=hash(*s); return f32(*s & 0x00FFFFFFu)/16777216.0; }
`
), be = (
  /* wgsl */
  `
${D}
struct U { w: f32, h: f32, dropLen: f32, speed: f32, wind: f32, windVar: f32, seed: u32, start: u32, count: u32, _p1: u32, _p2: u32, _p3: u32 };

@group(0) @binding(0) var<storage, read_write> p: array<Particle>;
@group(0) @binding(1) var<uniform> u: U;

${pe}

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  if (id.x >= u.count) { return; }
  let i = id.x + u.start;

  var s = u.seed * 7919u + i * 6271u;
  var d: Particle;
  d.len = u.dropLen * (0.7 + rng(&s) * 0.6);
  let bs = u.speed * (0.8 + rng(&s) * 0.4) * 15.0;
  let wr = (u.wind + (rng(&s) * 2.0 - 1.0) * u.windVar) * 0.01745329;
  let tx = tan(wr) * bs;
  let m = sqrt(tx * tx + bs * bs);
  d.sx = tx; d.sy = bs; d.dx = tx / m; d.dy = bs / m;
  d.x = rng(&s) * u.w;
  d.y = rng(&s) * u.h;
  d._p = 0.0;
  p[i] = d;
}
`
), ve = (
  /* wgsl */
  `
${D}
struct U { w: f32, h: f32, dropLen: f32, speed: f32, wind: f32, windVar: f32, dt: f32, seed: u32, count: u32, _p1: u32, _p2: u32, _p3: u32 };

@group(0) @binding(0) var<storage, read_write> p: array<Particle>;
@group(0) @binding(1) var<uniform> u: U;

${pe}

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let i = id.x;
  if (i >= u.count) { return; }
  var d = p[i];

  d.x += d.sx * u.dt;
  d.y += d.sy * u.dt;

  if (d.y > u.h || d.x < -100.0 || d.x > u.w + 100.0) {
    var s = u.seed * 7919u + i * 6271u;
    d.len = u.dropLen * (0.7 + rng(&s) * 0.6);
    let bs = u.speed * (0.8 + rng(&s) * 0.4) * 15.0;
    let wr = (u.wind + (rng(&s) * 2.0 - 1.0) * u.windVar) * 0.01745329;
    let tx = tan(wr) * bs;
    let m = sqrt(tx * tx + bs * bs);
    d.sx = tx; d.sy = bs; d.dx = tx / m; d.dy = bs / m;

    let sp = rng(&s) * (u.w + u.h);
    if (sp < u.w) { d.x = sp; d.y = -(20.0 + rng(&s) * 80.0); }
    else { d.y = sp - u.w; d.x = select(u.w + 10.0 + rng(&s) * 40.0, -(10.0 + rng(&s) * 40.0), u.wind >= 0.0); }
  }
  p[i] = d;
}
`
), he = (
  /* wgsl */
  `
${D}
struct U { w: f32, h: f32, hw: f32, opacity: f32, r: f32, g: f32, b: f32, _p: f32 };

@group(0) @binding(0) var<storage, read> p: array<Particle>;
@group(0) @binding(1) var<uniform> u: U;

@vertex fn vs(@builtin(instance_index) inst: u32, @builtin(vertex_index) v: u32) -> @builtin(position) vec4<f32> {
  let d = p[inst];
  let hl = d.len * 0.5;
  let along = vec2f(d.dx, d.dy);
  let perp = vec2f(-d.dy, d.dx) * u.hw;
  let tip = vec2f(d.x, d.y) + along * hl;
  let tail = vec2f(d.x, d.y) - along * hl;
  var pos: vec2f;
  switch(v) {
    case 0u: { pos = tail + perp; }
    case 1u: { pos = tail - perp; }
    case 2u: { pos = tip + perp; }
    case 3u: { pos = tip + perp; }
    case 4u: { pos = tail - perp; }
    case 5u: { pos = tip - perp; }
    default: { pos = vec2f(0.0); }
  }
  return vec4f(pos.x / u.w * 2.0 - 1.0, 1.0 - pos.y / u.h * 2.0, 0.0, 1.0);
}

@fragment fn fs() -> @location(0) vec4<f32> {
  let a = u.opacity;
  return vec4f(u.r * a, u.g * a, u.b * a, a);
}
`
), W = 32, fe = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC;
function Pe() {
  const r = we(), { width: c, height: f } = ye(), N = ce(null), [z, b] = ge(""), U = {
    rainColor: r.rainColor ?? o.rainColor,
    rainIntensity: r.rainIntensity ?? o.rainIntensity,
    rainSpeed: r.rainSpeed ?? o.rainSpeed,
    dropLength: r.dropLength ?? o.dropLength,
    dropWidth: r.dropWidth ?? o.dropWidth,
    windAngle: r.windAngle ?? o.windAngle,
    windVariation: r.windVariation ?? o.windVariation,
    enableGlow: r.enableGlow ?? o.enableGlow,
    glowIntensity: r.glowIntensity ?? o.glowIntensity,
    opacity: r.opacity ?? o.opacity
  }, P = ce(U);
  return P.current = U, me(() => {
    const x = N.current;
    if (!x || c === 0 || f === 0) return;
    if (!navigator.gpu) {
      b("WebGPU not supported");
      return;
    }
    let v = !0, h = 0, e = null, B = null;
    return b(""), (async () => {
      const k = await navigator.gpu.requestAdapter();
      if (!v) return;
      if (!k) {
        b("No GPU adapter");
        return;
      }
      if (e = await k.requestDevice(), !v) {
        e.destroy();
        return;
      }
      e.lost.then((i) => {
        v && b(`GPU device lost: ${i.message}`);
      });
      const Y = Math.min(devicePixelRatio || 1, 2);
      x.width = c * Y, x.height = f * Y;
      const G = x.getContext("webgpu");
      if (!G) {
        b("No WebGPU context");
        return;
      }
      const $ = navigator.gpu.getPreferredCanvasFormat();
      G.configure({ device: e, format: $, alphaMode: "premultiplied" });
      const j = e.createComputePipeline({
        layout: "auto",
        compute: { module: e.createShaderModule({ code: be }), entryPoint: "main" }
      }), H = e.createComputePipeline({
        layout: "auto",
        compute: { module: e.createShaderModule({ code: ve }), entryPoint: "main" }
      }), J = e.createShaderModule({ code: he }), F = e.createRenderPipeline({
        layout: "auto",
        vertex: { module: J, entryPoint: "vs" },
        fragment: {
          module: J,
          entryPoint: "fs",
          targets: [{
            format: $,
            blend: {
              color: { srcFactor: "one", dstFactor: "one-minus-src-alpha" },
              alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha" }
            }
          }]
        },
        primitive: { topology: "triangle-list" }
      }), K = e.createBuffer({ size: 48, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST }), Q = e.createBuffer({ size: 48, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST }), X = e.createBuffer({ size: 32, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST }), Z = e.createBuffer({ size: 32, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST }), _ = new ArrayBuffer(48), g = new Float32Array(_), C = new Uint32Array(_), A = new ArrayBuffer(48), p = new Float32Array(A), ee = new Uint32Array(A), u = new Float32Array(8), d = new Float32Array(8);
      let m = U.rainIntensity, l = e.createBuffer({ size: m * W, usage: fe });
      const te = (i, a, t) => {
        const n = P.current;
        g[0] = c, g[1] = f, g[2] = n.dropLength, g[3] = n.rainSpeed, g[4] = n.windAngle, g[5] = n.windVariation, C[6] = t, C[7] = i, C[8] = a, e.queue.writeBuffer(K, 0, _);
        const q = e.createBindGroup({
          layout: j.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: l } },
            { binding: 1, resource: { buffer: K } }
          ]
        }), w = e.createCommandEncoder(), s = w.beginComputePass();
        s.setPipeline(j), s.setBindGroup(0, q), s.dispatchWorkgroups(Math.ceil(a / 256)), s.end(), e.queue.submit([w.finish()]);
      };
      te(0, m, 42);
      let ne, re, ie;
      const oe = () => {
        ne = e.createBindGroup({
          layout: H.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: l } },
            { binding: 1, resource: { buffer: Q } }
          ]
        }), re = e.createBindGroup({
          layout: F.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: l } },
            { binding: 1, resource: { buffer: X } }
          ]
        }), ie = e.createBindGroup({
          layout: F.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: l } },
            { binding: 1, resource: { buffer: Z } }
          ]
        });
      };
      oe();
      let ae = "", S = 168 / 255, I = 200 / 255, L = 232 / 255;
      const le = (i) => {
        if (i === ae) return;
        const a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(i);
        a && (S = parseInt(a[1], 16) / 255, I = parseInt(a[2], 16) / 255, L = parseInt(a[3], 16) / 255), ae = i;
      };
      let R = performance.now(), E = 0, T = !1;
      B = () => {
        document.hidden ? (T = !0, cancelAnimationFrame(h)) : (T = !1, R = performance.now(), h = requestAnimationFrame(M));
      };
      const M = (i) => {
        if (!v || T) return;
        const a = Math.min(i - R, 50) * 0.06;
        R = i, E++;
        const t = P.current, n = t.rainIntensity;
        if (n > m) {
          const se = l, O = m, V = Math.max(n, m * 2);
          l = e.createBuffer({ size: V * W, usage: fe });
          const ue = e.createCommandEncoder();
          ue.copyBufferToBuffer(se, 0, l, 0, O * W), e.queue.submit([ue.finish()]), se.destroy(), te(O, V - O, E), m = V, oe();
        }
        const q = Math.ceil(n / 256);
        le(t.rainColor), p[0] = c, p[1] = f, p[2] = t.dropLength, p[3] = t.rainSpeed, p[4] = t.windAngle, p[5] = t.windVariation, p[6] = a, ee[7] = E, ee[8] = n, e.queue.writeBuffer(Q, 0, A), u[0] = c, u[1] = f, u[2] = t.dropWidth * 0.5, u[3] = t.opacity, u[4] = S, u[5] = I, u[6] = L, e.queue.writeBuffer(X, 0, u), t.enableGlow && (d[0] = c, d[1] = f, d[2] = t.dropWidth * 1.5, d[3] = t.opacity * t.glowIntensity, d[4] = S, d[5] = I, d[6] = L, e.queue.writeBuffer(Z, 0, d));
        const w = e.createCommandEncoder(), s = w.beginComputePass();
        s.setPipeline(H), s.setBindGroup(0, ne), s.dispatchWorkgroups(q), s.end();
        const y = w.beginRenderPass({
          colorAttachments: [{
            view: G.getCurrentTexture().createView(),
            loadOp: "clear",
            storeOp: "store",
            clearValue: { r: 0, g: 0, b: 0, a: 0 }
          }]
        });
        y.setPipeline(F), t.enableGlow && (y.setBindGroup(0, ie), y.draw(6, n)), y.setBindGroup(0, re), y.draw(6, n), y.end(), e.queue.submit([w.finish()]), h = requestAnimationFrame(M);
      };
      document.addEventListener("visibilitychange", B), h = requestAnimationFrame(M);
    })(), () => {
      v = !1, cancelAnimationFrame(h), B && document.removeEventListener("visibilitychange", B), e?.destroy();
    };
  }, [c, f]), z ? /* @__PURE__ */ de("div", { style: { color: "#ff6b6b", fontFamily: "monospace", padding: 16 }, children: z }) : /* @__PURE__ */ de(
    "canvas",
    {
      ref: N,
      style: { width: "100%", height: "100%", display: "block" }
    }
  );
}
export {
  Pe as default
};
