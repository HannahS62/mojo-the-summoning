const { describe, it, expect, beforeAll, afterAll } = require("@jest/globals");
const { User, Deck, Card, Attack } = require("./index");
const { db } = require("../db/config");

// clear db and create new user before tests
beforeAll(async () => {
  await db.sync({ force: true });
});

afterEach(async () => {
  await db.truncate({ cascade: true }); // cascade will remove assosiated data
});

describe("The Attack Model", () => {
  it("Creates an attack", async () => {
    const attack = await Attack.create({
      title: "sword",
      mojoCost: 60,
      staminaCost: 40,
    });
    expect(attack).toBeInstanceOf(Attack);
    expect(attack.title).toBe("sword");
  });

  it("Finds an attack", async () => {
    let attack = await Attack.create({
      title: "sword",
      mojoCost: 60,
      staminaCost: 40,
    });
    attack = await Attack.findOne({ where: { title: "sword" } });
    expect(attack).toBeInstanceOf(Attack);
    expect(attack.title).toBe("sword");
    expect(attack.mojoCost).toBe(60);
  });

  it("Updates an attack", async () => {
    let attack = await Attack.create({
      title: "rope",
      mojoCost: 20,
      staminaCost: 75,
    });

    attack = await attack.update({ staminaCost: 15 });
    expect(attack.staminaCost).toBe(15);
  });

  it("Deletes an attack", async () => {
    let attack = await Attack.create({
      title: "rope",
      mojoCost: 20,
      staminaCost: 75,
    });
    await attack.destroy();
    attack = await Attack.findByPk(attack.id);
    expect(attack).toBeNull();
  });
});
