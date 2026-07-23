class KinematicsEngine {
  constructor() {
    this.G = 9.81;
  }

  position1D(x0, v, a, t) {
    return x0 + v * t + 0.5 * a * t * t;
  }

  velocity1D(v0, a, t) {
    return v0 + a * t;
  }

  meetingData1D(x10, v10, a10, x20, v20, a20) {
    const A = 0.5 * (a10 - a20);
    const B = v10 - v20;
    const C = x10 - x20;

    let roots = [];
    const eps = 1e-9;

    if (Math.abs(A) < eps) {
      if (Math.abs(B) < eps) {
        if (Math.abs(C) < eps) {
          return {
            meets: true,
            infinite: true,
            time: 0,
            position: x10,
            A, B, C,
          };
        }
        return { meets: false, infinite: false, A, B, C };
      }
      const t = -C / B;
      if (t >= 0) roots.push(t);
    } else {
      const disc = B * B - 4 * A * C;
      if (disc >= -eps) {
        const safeDisc = Math.max(0, disc);
        const sqrtDisc = Math.sqrt(safeDisc);
        const t1 = (-B - sqrtDisc) / (2 * A);
        const t2 = (-B + sqrtDisc) / (2 * A);
        if (t1 >= 0) roots.push(t1);
        if (t2 >= 0) roots.push(t2);
      }
    }

    roots = roots.filter(t => Number.isFinite(t)).sort((m, n) => m - n);
    if (roots.length === 0) {
      return { meets: false, infinite: false, A, B, C };
    }

    const tMeet = roots[0];
    const xMeet = this.position1D(x10, v10, a10, tMeet);
    return {
      meets: true,
      infinite: false,
      time: tMeet,
      position: xMeet,
      A, B, C,
      roots,
    };
  }

  projectileMotion(v0, angleRad, t) {
    const vx = v0 * Math.cos(angleRad);
    const vy = v0 * Math.sin(angleRad);
    const x = vx * t;
    const y = vy * t - 0.5 * this.G * t * t;
    return { x, y, vx, vy };
  }

  circularMotion(r, omega, t) {
    const theta = omega * t;
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    const vt = r * omega;
    const at = r * omega * omega;
    return { x, y, theta, vt, at };
  }

  gravity(m1, m2, r) {
    const G = 6.674e-11;
    return (G * m1 * m2) / (r * r);
  }

  gravityAccel(M, r) {
    const G = 6.674e-11;
    return (G * M) / (r * r);
  }
}
