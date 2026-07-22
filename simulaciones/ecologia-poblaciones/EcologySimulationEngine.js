class EcologySimulationEngine {
  constructor(width, height, speciesConfig) {
    this.width = width;
    this.height = height;
    this.speciesConfig = speciesConfig;
    this.cycle = 0;
    this.world = { bugs: [], nextId: 1 };
    this.params = {
      greenCollisionCost: 1,
      redSpeed: 2,
      blueSpeed: 2,
    };
  }

  createPopulation(greenCount, redCount, blueCount) {
    const bugs = [];
    let id = 1;

    for (let i = 0; i < greenCount; i++) {
      bugs.push(this.makeBug(id++, 'green', MathUtils.random(0, this.width), MathUtils.random(0, this.height)));
    }
    for (let i = 0; i < redCount; i++) {
      bugs.push(this.makeBug(id++, 'red', MathUtils.random(0, this.width), MathUtils.random(0, this.height)));
    }
    for (let i = 0; i < blueCount; i++) {
      bugs.push(this.makeBug(id++, 'blue', MathUtils.random(0, this.width), MathUtils.random(0, this.height)));
    }

    this.world = { bugs, nextId: id };
    this.cycle = 0;
  }

  makeBug(id, kind, x, y) {
    const cfg = this.speciesConfig[kind];
    const direction = MathUtils.chooseDirectionVector();
    return {
      id,
      kind,
      x,
      y,
      dx: direction.dx,
      dy: direction.dy,
      energy: cfg.startEnergy,
      stepsRemaining: MathUtils.randomInt(1, cfg.movementLength),
    };
  }

  chooseNewDirection(bug) {
    const cfg = this.speciesConfig[bug.kind];
    const direction = MathUtils.chooseDirectionVector();
    bug.dx = direction.dx;
    bug.dy = direction.dy;
    bug.stepsRemaining = MathUtils.randomInt(1, cfg.movementLength);
  }

  countBugs() {
    let g = 0, r = 0, b = 0;
    for (const bug of this.world.bugs) {
      if (bug.kind === 'green') g += 1;
      else if (bug.kind === 'red') r += 1;
      else if (bug.kind === 'blue') b += 1;
    }
    return { g, r, b };
  }

  addBugs(kind, amount) {
    for (let i = 0; i < amount; i++) {
      this.world.bugs.push(
        this.makeBug(
          this.world.nextId++,
          kind,
          MathUtils.random(0, this.width),
          MathUtils.random(0, this.height)
        )
      );
    }
  }

  simulateOneCycle() {
    const bugs = this.world.bugs;
    this.cycle += 1;

    // Movement
    for (const bug of bugs) {
      bug.stepsRemaining -= 1;
      if (bug.stepsRemaining <= 0) this.chooseNewDirection(bug);

      const cfg = this.speciesConfig[bug.kind];
      const movementSpeed =
        bug.kind === 'red'
          ? this.params.redSpeed
          : bug.kind === 'blue'
            ? this.params.blueSpeed
            : cfg.speed;
      bug.x = MathUtils.wrap(bug.x + bug.dx * movementSpeed, this.width);
      bug.y = MathUtils.wrap(bug.y + bug.dy * movementSpeed, this.height);
      bug.energy += cfg.energyChangePerCycle;
    }

    // Collisions
    const dead = new Set();
    const newborns = [];

    for (let i = 0; i < bugs.length; i++) {
      if (dead.has(bugs[i].id)) continue;

      for (let j = i + 1; j < bugs.length; j++) {
        if (dead.has(bugs[j].id)) continue;

        const a = bugs[i];
        const b = bugs[j];
        const aCfg = this.speciesConfig[a.kind];
        const bCfg = this.speciesConfig[b.kind];
        const dx = MathUtils.toroidalDelta(b.x - a.x, this.width);
        const dy = MathUtils.toroidalDelta(b.y - a.y, this.height);
        const dist = Math.hypot(dx, dy);
        const contactDistance = aCfg.radius + bCfg.radius;

        if (dist < contactDistance) {
          const aIsPredator = a.kind === 'red' || a.kind === 'blue';
          const bIsPredator = b.kind === 'red' || b.kind === 'blue';

          if (aIsPredator && b.kind === 'green') {
            a.energy += b.energy;
            dead.add(b.id);
          } else if (a.kind === 'green' && bIsPredator) {
            b.energy += a.energy;
            dead.add(a.id);
          } else if (a.kind === 'green' && b.kind === 'green') {
            a.energy -= this.params.greenCollisionCost;
            b.energy -= this.params.greenCollisionCost;
          }
        }
      }
    }

    this.world.bugs = bugs.filter((bug) => !dead.has(bug.id) && bug.energy > 0);

    // Reproduction
    for (const bug of this.world.bugs) {
      const cfg = this.speciesConfig[bug.kind];
      if (bug.energy >= cfg.splitEnergy) {
        bug.energy = cfg.startEnergy;
        const child = this.makeBug(
          this.world.nextId++,
          bug.kind,
          MathUtils.wrap(bug.x + MathUtils.randomInt(-cfg.divisionOffset, cfg.divisionOffset), this.width),
          MathUtils.wrap(bug.y + MathUtils.randomInt(-cfg.divisionOffset, cfg.divisionOffset), this.height)
        );
        child.energy = cfg.startEnergy;
        newborns.push(child);
      }
    }

    this.world.bugs.push(...newborns);
  }

  advance(cycles = 1) {
    for (let i = 0; i < cycles; i++) {
      this.simulateOneCycle();
    }
  }

  reset(greenCount = 1, redCount = 0, blueCount = 0) {
    this.createPopulation(greenCount, redCount, blueCount);
  }
}
