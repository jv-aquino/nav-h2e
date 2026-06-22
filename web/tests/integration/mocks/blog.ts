export const blogIdMock = "507f1f77bcf86cd799439011";
export const blockIdMock = "507f1f77bcf86cd799439012";
export const blockIdMock2 = "507f1f77bcf86cd799439013";

export const getBlogsMock = [
  {
    id: blogIdMock,
    name: "Blog 1",
    slug: "blog-1",
    imageUrl: null,
    publishedAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    tags: ["tag-1"],
    archived: false,
  },
];

export const postBlogMock = {
  name: "Novo Blog",
  slug: "novo-blog",
  tags: ["hidrogenio"],
};

export const getBlogMock = {
  ...getBlogsMock[0],
  contentBlocks: [
    {
      id: blockIdMock,
      blogId: blogIdMock,
      type: "MARKDOWN",
      order: 0,
      markdown: "# Titulo",
      videoUrl: null,
      metadata: null,
      archived: false,
    },
  ],
};

export const postMarkdownBlockMock = {
  type: "MARKDOWN",
  markdown: "# Conteudo",
};

export const reorderBlocksMock = {
  blocks: [
    { id: blockIdMock2, order: 0 },
    { id: blockIdMock, order: 1 },
  ],
};
