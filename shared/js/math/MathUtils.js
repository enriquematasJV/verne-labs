class MathUtils {
  static random(min, max) {
    return Math.random() * (max - min) + min;
  }

  static randomInt(min, max) {
    return Math.floor(this.random(min, max + 1));
  }

  static wrap(value, size) {
    if (value < 0) return value + size;
    if (value >= size) return value - size;
    return value;
  }

  static toroidalDelta(delta, size) {
    if (delta > size / 2) return delta - size;
    if (delta < -size / 2) return delta + size;
    return delta;
  }

  static chooseDirectionVector() {
    const angle = this.random(0, Math.PI * 2);
    return { dx: Math.cos(angle), dy: Math.sin(angle) };
  }

  static clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  static distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.hypot(dx, dy);
  }
}
