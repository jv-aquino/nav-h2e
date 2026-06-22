import { NextRequest, NextResponse } from "next/server";
import { createBlog, getAllBlogs } from "@/backend/services/blogs";
import { createBlogSchema } from "@/backend/schemas";
import {
  blockForbiddenRequests,
  returnInvalidDataErrors,
  validBody,
  zodErrorHandler,
} from "@/utils";
import type { AllowedRoutes } from "@/types";
import { toErrorMessage } from "@/utils/api/toErrorMessage";

const adminRoles: AllowedRoutes = {
  POST: ["SUPER_ADMIN", "ADMIN"],
};

function parseArchivedFilter(request: NextRequest) {
  const archivedParam = request.nextUrl.searchParams.get("archived");

  if (archivedParam === null) {
    return undefined;
  }

  if (archivedParam === "true") {
    return true;
  }

  if (archivedParam === "false") {
    return false;
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const archived = parseArchivedFilter(request);

    if (archived === null) {
      return NextResponse.json(
        toErrorMessage('Parâmetro "archived" deve ser "true" ou "false"'),
        { status: 400 }
      );
    }

    const blogs = await getAllBlogs({ archived });

    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    return zodErrorHandler(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const forbidden = await blockForbiddenRequests(request, adminRoles.POST);

    if (forbidden) {
      return forbidden;
    }

    const body = await validBody(request);
    const validationResult = createBlogSchema.safeParse(body);

    if (!validationResult.success) {
      return returnInvalidDataErrors(validationResult.error);
    }

    const blog = await createBlog(validationResult.data);

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        if (error.message.includes("slug")) {
          return NextResponse.json(
            toErrorMessage("Um blog com esse slug já existe"),
            { status: 409 }
          );
        }

        return NextResponse.json(
          toErrorMessage("Um blog com esses dados já existe"),
          { status: 409 }
        );
      }

      if (error.message.includes("Prisma")) {
        return NextResponse.json(
          toErrorMessage(
            "Erro no banco de dados - Verifique os dados fornecidos"
          ),
          { status: 400 }
        );
      }
    }

    return zodErrorHandler(error);
  }
}
