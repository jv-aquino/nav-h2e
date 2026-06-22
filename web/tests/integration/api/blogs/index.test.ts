import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { NextRequest } from "next/server";
import * as blogService from "@/backend/services/blogs";
import { GET, POST } from "@/backend/api/blogs/route";
import { getBlogsMock, postBlogMock } from "../../mocks/blog";
import { setCurrentRole } from "../../mocks/auth";
import { createRequest } from "../../mocks/requests";

vi.mock("@/backend/services/blogs", () => ({
  getAllBlogs: vi.fn(),
  createBlog: vi.fn(),
}));

describe("GET /api/blogs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setCurrentRole(null);
  });

  it("should return blogs from the service", async () => {
    (blogService.getAllBlogs as Mock).mockResolvedValue(getBlogsMock);

    const response = await GET(
      new NextRequest("http://localhost:3000/api/blogs")
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(getBlogsMock);
    expect(blogService.getAllBlogs).toHaveBeenCalledWith({ archived: undefined });
  });
});

describe("POST /api/blogs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setCurrentRole(null);
  });

  const createBlogRequest = () => createRequest(postBlogMock, "blogs");

  it("should fail if unauthenticated", async () => {
    const response = await POST(createBlogRequest());
    expect(response?.status).toBe(401);
  });

  it("should fail if user is not ADMIN or SUPER_ADMIN", async () => {
    setCurrentRole("USER");
    const response = await POST(createBlogRequest());
    expect(response?.status).toBe(403);
  });

  it("should succeed if user is ADMIN", async () => {
    setCurrentRole("ADMIN");
    (blogService.createBlog as Mock).mockResolvedValue(getBlogsMock[0]);

    const response = await POST(createBlogRequest());
    expect(response?.status).toBe(201);

    const data = await response?.json();
    expect(data).toEqual(getBlogsMock[0]);
    expect(blogService.createBlog).toHaveBeenCalledWith(postBlogMock);
  });

  it("should succeed if user is SUPER_ADMIN", async () => {
    setCurrentRole("SUPER_ADMIN");
    (blogService.createBlog as Mock).mockResolvedValue(getBlogsMock[0]);

    const response = await POST(createBlogRequest());
    expect(response?.status).toBe(201);

    const data = await response?.json();
    expect(data).toEqual(getBlogsMock[0]);
    expect(blogService.createBlog).toHaveBeenCalledWith(postBlogMock);
  });
});
