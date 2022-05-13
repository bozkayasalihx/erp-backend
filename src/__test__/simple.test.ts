import request from "supertest";
import { main } from "../app";

describe("Post Endpoints", () => {
    // it("should create a new user", async () => {
    //     const app = await main();
    //     const resp = await request(app).post("/api/register").send({
    //         username: "uncle bob",
    //         email: "uncle_bob@gmail.com",
    //         password: "uncle_bob@gmail.com",
    //         user_type: "VA",
    //         tckn: "38492384289",
    //         mobile: "5376852365",
    //     });
    //     expect(resp.body).toHaveProperty("post");
    // });

    test("should register a new user", async () => {
        const app = await main();
        const res = await request(app).post("/api/register").send({
            username: "uncle bob",
            email: "uncle_bob@gmail.com",
            password: "uncle_bob@gmail.com",
            user_type: "VA",
            tckn: "38492384289",
            mobile: "5376852365",
        });
    });
});
