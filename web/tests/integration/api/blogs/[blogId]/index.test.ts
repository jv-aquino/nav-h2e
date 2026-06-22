/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import * as blogService from "@/backend/services/blogs";
import { GET, PATCH, DELETE } from "@/backend/api/blogs/[blogId]/route";
import { blogIdMock, getBlogMock } from "../../../mocks/blog";
import { setCurrentRole } from "../../../mocks/auth";
import { createRequest, returnParams } from "../../../mocks/requests";

vi.mock("@/backend/services/blogs", () => ({
  getBlogById: vi.fn(),
  updateBlog: vi.fn(),
  deleteBlog: vi.fn(),
}));

describe("GET /api/blogs/[blogId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockRequest = {} as Request;

  it("should return blog if it exists", async () => {
    (blogService.getBlogById as Mock).mockResolvedValue(getBlogMock);

    const response = await GET(
      mockRequest,
      returnParams({ blogId: blogIdMock }) as any
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(getBlogMock);
    expect(blogService.getBlogById).toHaveBeenCalledWith(blogIdMock);
  });

  it("should return 404 if blog is not found", async () => {
    (blogService.getBlogById as Mock).mockResolvedValue(null);

    const response = await GET(
      mockRequest,
      returnParams({ blogId: blogIdMock }) as any
    );

    expect(response.status).toBe(404);
  });
});

describe("PATCH /api/blogs/[blogId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setCurrentRole(null);
  });

  it("should fail if unauthenticated", async () => {
    const response = await PATCH(
      createRequest({ archived: true }, `blogs/${blogIdMock}`, "PATCH"),
      returnParams({ blogId: blogIdMock }) as any
    );

    expect(response.status).toBe(401);
  });

  it("should succeed if user is ADMIN", async () => {
    setCurrentRole("ADMIN");
    (blogService.getBlogById as Mock).mockResolvedValue(getBlogMock);
    (blogService.updateBlog as Mock).mockResolvedValue({
      ...getBlogMock,
      archived: true,
    });

    const response = await PATCH(
      createRequest({ archived: true }, `blogs/${blogIdMock}`, "PATCH"),
      returnParams({ blogId: blogIdMock }) as any
    );

    expect(response.status).toBe(200);
    expect(blogService.updateBlog).toHaveBeenCalledWith(blogIdMock, {
      archived: true,
    });
  });
});

describe("DELETE /api/blogs/[blogId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setCurrentRole(null);
  });

  it("should fail if user is not ADMIN or SUPER_ADMIN", async () => {
    setCurrentRole("USER");

    const response = await DELETE(
      createRequest({}, `blogs/${blogIdMock}`, "DELETE"),
      returnParams({ blogId: blogIdMock }) as any
    );

    expect(response.status).toBe(403);
  });

  it("should succeed if user is SUPER_ADMIN", async () => {
    setCurrentRole("SUPER_ADMIN");
    (blogService.getBlogById as Mock).mockResolvedValue(getBlogMock);
    (blogService.deleteBlog as Mock).mockResolvedValue(getBlogMock);

    const response = await DELETE(
      createRequest({}, `blogs/${blogIdMock}`, "DELETE"),
      returnParams({ blogId: blogIdMock }) as any
    );

    expect(response.status).toBe(200);
    expect(blogService.deleteBlog).toHaveBeenCalledWith(blogIdMock);
  });
});
