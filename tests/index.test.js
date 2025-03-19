const request = require("supertest");
const express = require("express");
const app = require("../index"); // Ensure index.js exports 'app'

describe("User Management API", () => {
    let testUser = {
        username: "testuser",
        password: "password123",
        fullName: "Test User",
        email: "test@example.com",
    };

    it("should register a new user", async () => {
        const res = await request(app).post("/register").send(testUser);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty(
            "message",
            "User registered successfully"
        );
        expect(res.body.user).toHaveProperty("username", testUser.username);
    });

    it("should not allow duplicate user registration", async () => {
        const res = await request(app).post("/register").send(testUser);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error", "Username already exists");
    });

    it("should log in a user with correct credentials", async () => {
        const res = await request(app).post("/login").send({
            username: testUser.username,
            password: testUser.password,
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Login successful");
    });

    it("should not log in a user with incorrect credentials", async () => {
        const res = await request(app).post("/login").send({
            username: testUser.username,
            password: "wrongpassword",
        });
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty(
            "error",
            "Invalid username or password"
        );
    });

    it("should retrieve user details", async () => {
        const res = await request(app).get(`/user/${testUser.username}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("username", testUser.username);
    });

    it("should list all users", async () => {
        const res = await request(app).get("/users");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("should delete a user", async () => {
        const res = await request(app).delete(
            `/delete-user/${testUser.username}`
        );
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty(
            "message",
            `User ${testUser.username} deleted successfully`
        );
    });

    it("should return 404 for non-existent user", async () => {
        const res = await request(app).get("/user/nonexistent");
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error", "User not found");
    });
});
