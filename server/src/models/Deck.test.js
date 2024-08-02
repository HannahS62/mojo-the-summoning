const { describe, it, expect, beforeAll, afterAll } = require("@jest/globals");
const { User, Deck, Card } = require("./index");
const { db } = require("../db/config");

beforeAll(async () => {
  await db.sync({ force: true });
});

afterEach(async () => {
  await db.truncate({ cascade: true }); // cascade will remove assosiated data
});

describe("The Deck Model", () => {
  it("Created a Deck", async () => {
    const deck = await Deck.create({ name: "Fire", xp: 150 });
    expect(deck).toBeInstanceOf(Deck);
    expect(deck.name).toBe("Fire");
    expect(deck.xp).toBe(150);
  });

  it("Finds a deck", async () => {
    await Deck.create({ name: "Fire", xp: 150 });
    const deck = await Deck.findOne({
      where: {
        name: "Fire",
      },
    });
    expect(deck).toBeInstanceOf(Deck);
    expect(deck.name).toBe("Fire");
    expect(deck.xp).toBe(150);
  });

  it("Updates a deck", async () => {
    let deck = await Deck.create({ name: "Water", xp: 80 });
    deck = await deck.update({ xp: 75 });
    expect(deck.xp).toBe(75);
  });

  it("Deleted a deck", async () => {
    let deck = await Deck.create({ name: "Wind", xp: 30 });
    await deck.destroy();
    deck = await Deck.findByPk(deck.id);
    expect(deck).toBeNull();
  });

  it("Has exaclty one Deck", async () => {
    let deck = await Deck.create({ name: "Fire", xp: 150 });
    const user1 = await User.create({ username: "gandalf" });
    const user2 = await User.create({ username: "dumbledore" });

    await deck.setUser(user1);
    await deck.setUser(user2);

    deck = await Deck.findByPk(deck.id);
    const finalUser = await deck.getUser();
    expect(finalUser.toJSON()).toEqual(user2.toJSON());
  });
  it("Has many cards", async () => {
    //
    // Arrange
    //

    // Creates a deck.
    const deck = await Deck.create({ name: "Grass", xp: 25 });

    // Creates multiple cards in bulk.
    const cards = await Card.bulkCreate([
      {
        name: "Arcturus Spellweaver",
        mojo: 100,
        stamina: 10,
        imgUrl: "http://localhost:5000/img/arcturus-spellweaver.jpg",
      },
      {
        name: "Nimue Mistral",
        mojo: 100,
        stamina: 10,
        imgUrl: "http://localhost:5000/img/nimue-mistral.jpg",
      },
      {
        name: "Theron Thunderstrike",
        mojo: 100,
        stamina: 10,
        imgUrl: "http://localhost:5000/img/theron-thunderstrike.jpg",
      },
      {
        name: "Lirien Moonshadow",
        mojo: 100,
        stamina: 10,
        imgUrl: "http://localhost:5000/img/lirien-moonshadow.jpg",
      },
      {
        name: "Alaric Flamecaller",
        mojo: 100,
        stamina: 10,
        imgUrl: "http://localhost:5000/img/alaric-flamecaller.jpg",
      },
    ]);

    //
    // Act
    //

    // Associates the cards with the deck.
    await deck.setCards(cards);

    // Gets the cards that are now associated with the deck.
    const foundCards = await deck.getCards();

    //
    // Assert
    //

    // Expects the array of found cards to be equal to an array that contains
    // an array of objects that contains a specific subset of properties,
    // ignoring the createdAt, updatedAt, and DeckId properties.
    expect(foundCards).toEqual(
      expect.arrayContaining(
        cards.map((card) =>
          expect.objectContaining({
            id: card.id,
            name: card.name,
            mojo: card.mojo,
            stamina: card.stamina,
            imgUrl: card.imgUrl,
          })
        )
      )
    );
  });
});
