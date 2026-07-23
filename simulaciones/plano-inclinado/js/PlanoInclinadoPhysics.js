class PlanoInclinadoPhysics {
  static calculateInclinedPlane(mass, angleRad, mu, g = 9.8) {
    const parallel = mass * g * Math.sin(angleRad);
    const normal = mass * g * Math.cos(angleRad);
    const friction = mu * normal;
    const netForce = Math.max(0, parallel - friction);
    const acceleration = netForce / mass;
    const staticHold = acceleration < 0.001;

    return {
      parallel,
      normal,
      friction,
      netForce,
      acceleration,
      staticHold
    };
  }

  static theoreticalInclinedPlane(acceleration, distance) {
    if (acceleration < 0.001) return { time: Infinity, velocity: 0 };
    const time = Math.sqrt(2 * distance / acceleration);
    const velocity = acceleration * time;
    return { time, velocity };
  }
}
