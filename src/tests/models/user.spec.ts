import { query } from "../../database";
import UserStore from "../../models/User";
import { resetTables } from "../../utils/resetTables";

const store = new UserStore();

describe("User Model", () => {
  beforeAll(async () => {
    await resetTables();
  });

  beforeEach(async () => {
    await query(
      `INSERT INTO users (id, "firstName", "lastName", password_digest, username) VALUES (1,'John', 'Doe', 'password', 'john')`
    );
  });

  afterEach(async () => {
    await query("DELETE FROM users");
  });

  it("should return a user", async () => {
    expect(store.show).toBeDefined();

    const result = await store.show(1);
    expect(result.firstName).toEqual("John");
    expect(result.lastName).toEqual("Doe");
  });

  it("should return a list of users", async () => {
    expect(store.index).toBeDefined();

    const result = await store.index();
    expect(result.length).toEqual(1);
  });

  it("should create a user", async () => {
    await query("DELETE FROM users");
    expect(store.create).toBeDefined();

    const result = await store.create({
      firstName: "Jane",
      lastName: "Doe",
      username: "jane",
      password: "password",
    });
    expect(result.firstName).toEqual("Jane");
    expect(result.lastName).toEqual("Doe");
  });

  it("should throw error if username is taken already", async () => {
    await expectAsync(
      store.create({
        username: "john",
        firstName: "name",
        lastName: "name",
        password: "password",
      })
    ).toBeRejected();
  });

  afterAll(async () => await resetTables());
});
