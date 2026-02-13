import { jsx as W } from "react/jsx-runtime";
import { useRef as R, useCallback as P, useEffect as k } from "react";
import { useSettings as F, useViewport as X } from "@mywallpaper/sdk-react";
const p = {
  rainColor: "#a8c8e8",
  rainIntensity: 200,
  rainSpeed: 1.7,
  dropLength: 42,
  dropWidth: 0.8,
  windAngle: -5,
  windVariation: 0,
  enableGlow: !0,
  glowIntensity: 0.3,
  depthLayers: 3
};
function D(e) {
  const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
  return t ? `rgb(${parseInt(t[1], 16)},${parseInt(t[2], 16)},${parseInt(t[3], 16)})` : "rgb(168,200,232)";
}
function d(e, t) {
  return Math.random() * (t - e) + e;
}
function T(e, t, a, s, r) {
  const i = 1 - e / t.depthLayers * 0.6, w = t.dropLength * i * d(0.7, 1.3), l = t.dropWidth * i * d(0.8, 1.2), h = t.rainSpeed * i * d(0.8, 1.2) * 15, n = (t.windAngle + d(-t.windVariation, t.windVariation)) * Math.PI / 180, c = Math.tan(n) * h, g = h, u = Math.sqrt(c * c + g * g), y = d(0, a + s);
  let f, m;
  return y < a ? (f = y, m = r ? d(0, s) : d(-100, -20)) : (m = r ? d(0, s) : y - a, f = t.windAngle >= 0 ? d(-50, -10) : a + d(10, 50)), {
    layer: e,
    x: f,
    y: m,
    length: w,
    width: l,
    speedX: c,
    speedY: g,
    dirX: c / u,
    dirY: g / u,
    opacity: i * d(0.4, 0.9),
    glowWidth: t.enableGlow ? l * 3 : 0
  };
}
function Y(e, t, a) {
  const s = [], r = Math.floor(e.rainIntensity / e.depthLayers);
  for (let i = 0; i < e.depthLayers; i++) {
    const w = Math.floor(r * (1 + i * 0.3));
    for (let l = 0; l < w; l++)
      s.push(T(i, e, t, a, !0));
  }
  return s.sort((i, w) => w.layer - i.layer), s;
}
function j() {
  const e = F(), { width: t, height: a } = X(), s = R(null), r = {
    rainColor: e.rainColor ?? p.rainColor,
    rainIntensity: e.rainIntensity ?? p.rainIntensity,
    rainSpeed: e.rainSpeed ?? p.rainSpeed,
    dropLength: e.dropLength ?? p.dropLength,
    dropWidth: e.dropWidth ?? p.dropWidth,
    windAngle: e.windAngle ?? p.windAngle,
    windVariation: e.windVariation ?? p.windVariation,
    enableGlow: e.enableGlow ?? p.enableGlow,
    glowIntensity: e.glowIntensity ?? p.glowIntensity,
    depthLayers: e.depthLayers ?? p.depthLayers
  }, i = R(r);
  i.current = r;
  const w = P(
    (l, h, n) => {
      const c = T(
        l.layer,
        i.current,
        h,
        n,
        !1
      );
      Object.assign(l, c);
    },
    []
  );
  return k(() => {
    const l = s.current;
    if (!l || t === 0 || a === 0) return;
    const h = Math.min(window.devicePixelRatio || 1, 2);
    l.width = t * h, l.height = a * h;
    const n = l.getContext("2d", { alpha: !0 });
    n.setTransform(h, 0, 0, h, 0, 0);
    let c = Y(r, t, a), g = 0, u = performance.now();
    const y = (f) => {
      const m = Math.min(f - u, 50);
      u = f;
      const x = m * 0.06, I = i.current, V = D(I.rainColor);
      n.clearRect(0, 0, t, a), n.strokeStyle = V, n.lineCap = "round";
      for (let L = 0, G = c.length; L < G; L++) {
        const o = c[L];
        o.y += o.speedY * x, o.x += o.speedX * x, (o.y > a || o.x < -100 || o.x > t + 100) && w(o, t, a);
        const b = o.length * 0.5, A = o.x - o.dirX * b, S = o.y - o.dirY * b, C = o.x + o.dirX * b, M = o.y + o.dirY * b;
        I.enableGlow && (n.globalAlpha = o.opacity * I.glowIntensity, n.lineWidth = o.glowWidth, n.beginPath(), n.moveTo(A, S), n.lineTo(C, M), n.stroke()), n.globalAlpha = o.opacity, n.lineWidth = o.width, n.beginPath(), n.moveTo(A, S), n.lineTo(C, M), n.stroke();
      }
      n.globalAlpha = 1, g = requestAnimationFrame(y);
    };
    return g = requestAnimationFrame(y), () => {
      cancelAnimationFrame(g), c = [];
    };
  }, [
    t,
    a,
    r.rainIntensity,
    r.depthLayers,
    r.rainSpeed,
    r.dropLength,
    r.dropWidth,
    r.windAngle,
    r.windVariation,
    r.enableGlow,
    r.glowIntensity,
    r.rainColor,
    w
  ]), /* @__PURE__ */ W(
    "canvas",
    {
      ref: s,
      style: { width: "100%", height: "100%", display: "block" }
    }
  );
}
export {
  j as default
};
