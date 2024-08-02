const { describe, it, expect, beforeAll, afterAll } = require("@jest/globals");
const { User, Deck, Card } = require("./index");
const { db } = require("../db/config");

beforeAll(async () => {
  await db.sync({ force: true });
});

afterEach(async () => {
  await db.truncate({ cascade: true }); // cascade will remove assosiated data
});

describe("The Card Model", () => {
  it("Creates a Card", async () => {
    const card = await Card.create({
      name: "Arcturus Spellweaver",
      mojo: 100,
      stamina: 10,
      imgUrl: "http://localhost:5000/img/arcturus-spellweaver.jpg",
    });
    expect(card).toBeInstanceOf(Card);
    expect(card.name).toBe("Arcturus Spellweaver");
    expect(card.stamina).toBe(10);
  });

  it("Finds a Card", async () => {
    let card = await Card.create({
      name: "Arcturus Spellweaver",
      mojo: 100,
      stamina: 10,
      imgUrl: "http://localhost:5000/img/arcturus-spellweaver.jpg",
    });
    card = await Card.findOne({ where: { name: "Arcturus Spellweaver" } });
    expect(card).toBeInstanceOf(Card);
    expect(card.name).toBe("Arcturus Spellweaver");
  });

  it("Updates a Card", async () => {
    let card = await Card.create({
      name: "Nimue Mistral",
      mojo: 100,
      stamina: 10,
      imgUrl: "http://localhost:5000/img/nimue-mistral.jpg",
    });
    card = await card.update({ mojo: 95 });
    expect(card.mojo).toBe(95);
  });

  it("Deletes a Card", async () => {
    let card = await Card.create({
      name: "Nimue Mistral",
      mojo: 100,
      stamina: 10,
      imgUrl: "http://localhost:5000/img/nimue-mistral.jpg",
    });
    await card.destroy();
    card = await Card.findByPk(card.id);
    expect(card).toBeNull();
  });

  it("Has exaclty one Deck", async () => {
    let card = await Card.create({
      name: "Theron Thunderstrike",
      mojo: 100,
      stamina: 10,
      imgUrl: "http://localhost:5000/img/theron-thunderstrike.jpg",
    });
    const deck1 = await Deck.create({ name: "Fire", xp: 150 });
    let deck2 = await Deck.create({ name: "Water", xp: 75 });

    await card.setDeck(deck1);
    await card.setDeck(deck2);

    card = await Card.findByPk(card.id);
    deck2 = await Deck.findByPk(deck2.id);

    const finalDeck = await card.getDeck();
    expect(finalDeck.toJSON()).toEqual(deck2.toJSON());
  });
});
