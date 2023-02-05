const request = require("supertest");
const { app } = require("../app");
const seed = require("../utils/seeder");

describe("Woven API Test", () => {
    beforeEach(async () => {
        await seed();
    });

    describe("/contracts", () => {
        describe("GET /contracts/:id", () => {
            it("should require profile_id header to be in request headers", async () => {
                const res = await request(app).get("/contracts/1");
                expect(res.statusCode).toEqual(401);
                expect(res.body).toEqual({ message: "Not authorized!" });
            });

            it("should get contract by id", async () => {
                const res = await request(app)
                    .get("/contracts/2")
                    .set("profile_id", 1);
                expect(res.statusCode).toEqual(200);
            });

            it("should return 404 for contract belongs to someone else", async () => {
                const res = await request(app)
                    .get("/contracts/3")
                    .set("profile_id", 1);
                expect(res.statusCode).toEqual(404);
                expect(res.body).toEqual({ message: "Not Found!" });
            });
        });

        describe("GET /contracts", () => {
            it("should require profile_id header to be in request headers", async () => {
                const res = await request(app).get("/contracts");
                expect(res.statusCode).toEqual(401);
                expect(res.body).toEqual({ message: "Not authorized!" });
            });

            it("should get all active contracts for a profile", async () => {
                const res = await request(app)
                    .get("/contracts")
                    .set("profile_id", 1);
                expect(res.statusCode).toEqual(200);
            });
        });
    });

    describe("/jobs", () => {
        describe("GET /jobs/unpaid", () => {
            it("should require profile_id header to be in request headers", async () => {
                const res = await request(app).get("/jobs/unpaid");
                expect(res.statusCode).toEqual(401);
                expect(res.body).toEqual({});
            });

            it("should get all unpaid jobs for a user", async () => {
                const res = await request(app)
                    .get("/jobs/unpaid")
                    .set("profile_id", 1);
                expect(res.statusCode).toEqual(200);
            });
        });
    });

    describe("/admin", () => {
        describe("GET /admin/best-profession", () => {
            it("should require both dates to be set", async () => {
                const res = await request(app).get(
                    "/admin/best-profession?start=2020-08-10&"
                );
                expect(res.statusCode).toEqual(400);
            });

            it("should require valid date to be set", async () => {
                const res = await request(app).get(
                    "/admin/best-profession?start=2020-08-10&end=20124-04-241"
                );
                expect(res.statusCode).toEqual(400);
            });
        });
    });
});
