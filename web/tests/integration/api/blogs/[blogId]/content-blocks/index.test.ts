/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import * as blockService from "@/backend/services/blog-content-blocks";
import { GET, POST } from "@/backend/api/blogs/[blogId]/content-blocks/route";
import { PATCH as PATCHReorder } from "@/backend/api/blogs/[blogId]/content-blocks/reorder/route";
import {
  PATCH,
  DELETE,
} from "@/backend/api/blogs/[blogId]/content-blocks/[blockId]/route";
import {
  blockIdMock,
  blogIdMock,
  getBlogMock,
  postMarkdownBlockMock,
  reorderBlocksMock,
} from "../../../../mocks/blog";
import { setCurrentRole } from "../../../../mocks/auth";
import { createRequest, returnParams } from "../../../../mocks/requests";

vi.mock("@/backend/services/blog-content-blocks", () => ({
  getBlocksByBlogId: vi.fn(),
  createBlock: vi.fn(),
  getBlockById: vi.fn(),
  updateBlock: vi.fn(),
  deleteBlock: vi.fn(),
  reorderBlocks: vi.fn(),
}));

describe("GET /api/blogs/[blogId]/content-blocks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return blocks from the service", async () => {
    (blockService.getBlocksByBlogId as Mock).mockResolvedValue(
      getBlogMock.contentBlocks
    );

    const response = await GET(
      {} as Request,
      returnParams({ blogId: blogIdMock }) as any
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(getBlogMock.contentBlocks);
  });
});

describe("POST /api/blogs/[blogId]/content-blocks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setCurrentRole(null);
  });

  it("should fail if unauthenticated", async () => {
    const response = await POST(
      createRequest(postMarkdownBlockMock, `blogs/${blogIdMock}/content-blocks`),
      returnParams({ blogId: blogIdMock }) as any
    );

    expect(response.status).toBe(401);
  });

  it("should succeed if user is ADMIN", async () => {
    setCurrentRole("ADMIN");
    (blockService.createBlock as Mock).mockResolvedValue(
      getBlogMock.contentBlocks[0]
    );

    const response = await POST(
      createRequest(postMarkdownBlockMock, `blogs/${blogIdMock}/content-blocks`),
      returnParams({ blogId: blogIdMock }) as any
    );

    expect(response.status).toBe(201);
    expect(blockService.createBlock).toHaveBeenCalledWith(
      blogIdMock,
      postMarkdownBlockMock
    );
  });
});

describe("PATCH /api/blogs/[blogId]/content-blocks/reorder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setCurrentRole(null);
  });

  it("should fail if user is not ADMIN or SUPER_ADMIN", async () => {
    setCurrentRole("USER");

    const response = await PATCHReorder(
      createRequest(
        reorderBlocksMock,
        `blogs/${blogIdMock}/content-blocks/reorder`,
        "PATCH"
      ),
      returnParams({ blogId: blogIdMock }) as any
    );

    expect(response.status).toBe(403);
  });

  it("should succeed if user is SUPER_ADMIN", async () => {
    setCurrentRole("SUPER_ADMIN");
    (blockService.reorderBlocks as Mock).mockResolvedValue(
      getBlogMock.contentBlocks
    );

    const response = await PATCHReorder(
      createRequest(
        reorderBlocksMock,
        `blogs/${blogIdMock}/content-blocks/reorder`,
        "PATCH"
      ),
      returnParams({ blogId: blogIdMock }) as any
    );

    expect(response.status).toBe(200);
    expect(blockService.reorderBlocks).toHaveBeenCalledWith(
      blogIdMock,
      reorderBlocksMock
    );
  });
});

describe("PATCH /api/blogs/[blogId]/content-blocks/[blockId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setCurrentRole("ADMIN");
  });

  it("should update block when user is ADMIN", async () => {
    (blockService.updateBlock as Mock).mockResolvedValue(
      getBlogMock.contentBlocks[0]
    );

    const response = await PATCH(
      createRequest(
        { markdown: "# Atualizado" },
        `blogs/${blogIdMock}/content-blocks/${blockIdMock}`,
        "PATCH"
      ),
      returnParams({ blogId: blogIdMock, blockId: blockIdMock }) as any
    );

    expect(response.status).toBe(200);
    expect(blockService.updateBlock).toHaveBeenCalledWith(
      blogIdMock,
      blockIdMock,
      { markdown: "# Atualizado" }
    );
  });
});

describe("DELETE /api/blogs/[blogId]/content-blocks/[blockId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setCurrentRole("ADMIN");
  });

  it("should delete block when user is ADMIN", async () => {
    (blockService.deleteBlock as Mock).mockResolvedValue(
      getBlogMock.contentBlocks[0]
    );

    const response = await DELETE(
      createRequest(
        {},
        `blogs/${blogIdMock}/content-blocks/${blockIdMock}`,
        "DELETE"
      ),
      returnParams({ blogId: blogIdMock, blockId: blockIdMock }) as any
    );

    expect(response.status).toBe(200);
    expect(blockService.deleteBlock).toHaveBeenCalledWith(
      blogIdMock,
      blockIdMock
    );
  });
});
