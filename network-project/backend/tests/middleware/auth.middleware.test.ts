// Core
import { Request, Response, NextFunction } from "express";

// Libraries
import jwt from "jsonwebtoken";

// Middleware
import { protect, verifyAdmin } from "../../src/middleware/auth.middleware";

jest.mock("jsonwebtoken");

describe("Middleware: protect", (): void => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach((): void => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it("should return an error if no token is provided", (): void => {
    protect(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Not authorized, no token" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return an error if the token is invalid", (): void => {
    mockReq.headers = { authorization: "Bearer token_invalido" };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    protect(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Not authorized, token failed" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should allow access if the token is valid", (): void => {
    mockReq.headers = { authorization: "Bearer token_valido" };
    (jwt.verify as jest.Mock).mockReturnValue({
      id: 1,
      email: "test@example.com",
      role: "ADMIN",
    });

    protect(mockReq as Request, mockRes as Response, mockNext);

    expect(jwt.verify).toHaveBeenCalled();
    expect(mockReq.user).toEqual({
      id: 1,
      email: "test@example.com",
      role: "ADMIN",
    });
    expect(mockNext).toHaveBeenCalled();
  });
});

describe("Middleware: verifyAdmin", (): void => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it("should allow access if the user is ADMIN", (): void => {
    mockReq.user = { id: 1, email: "admin@test.com", role: "ADMIN" } as any;

    verifyAdmin(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it("should deny access if the user is not ADMIN", (): void => {
    mockReq.user = { id: 2, email: "user@test.com", role: "CUSTOMER" } as any;

    verifyAdmin(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Not authorized as an admin" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should deny access if no authenticated user is present", (): void => {
    verifyAdmin(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Not authorized as an admin" });
  });
});
