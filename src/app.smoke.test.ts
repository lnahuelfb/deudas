import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "./app";

describe("API smoke tests", () => {
  it("returns API health message", async () => {
    const response = await request(app).get("/api");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "API is working" });
  });

  it("protects accounts endpoint without auth cookie", async () => {
    const response = await request(app).get("/api/accounts");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Not authenticated" });
  });

  it("protects debts endpoint without auth cookie", async () => {
    const response = await request(app).get("/api/debts");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Not authenticated" });
  });
});
