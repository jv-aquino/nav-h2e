import { NextRequest, NextResponse } from "next/server";
import {
  deleteBlog,
  getBlogById,
  updateBlog,
} from "@/backend/services/blogs";
import { objectIdSchema, patchBlogSchema } from "@/backend/schemas";
import {
  blockForbiddenRequests,
  returnInvalidDataErrors,
  validBody,
  zodErrorHandler,
} from "@/utils";
import type { AllowedRoutes } from "@/types";
import { toErrorMessage } from "@/utils/api/toErrorMessage";

const adminRoles: AllowedRoutes = {
  PATCH: ["SUPER_ADMIN", "ADMIN"],
  DELETE: ["SUPER_ADMIN", "ADMIN"],
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
    const { blogId } = await params;
    const validationResult = objectIdSchema.safeParse(blogId);

    if (!validationResult.success) {
      return returnInvalidDataErrors(validationResult.error);
    }

    const blog = await getBlogById(blogId);

    if (!blog) {
      return NextResponse.json(
        toErrorMessage("Blog não encontrado"),
        { status: 404 }
      );
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    return zodErrorHandler(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
    const forbidden = await blockForbiddenRequests(request, adminRoles.PATCH);

    if (forbidden) {
      return forbidden;
    }

    const { blogId } = await params;
    const idValidationResult = objectIdSchema.safeParse(blogId);

    if (!idValidationResult.success) {
      return returnInvalidDataErrors(idValidationResult.error);
    }

    const body = await validBody(request);
    const validationResult = patchBlogSchema.safeParse(body);

    if (!validationResult.success) {
      return returnInvalidDataErrors(validationResult.error);
    }

    const existingBlog = await getBlogById(blogId);

    if (!existingBlog) {
      return NextResponse.json(
        toErrorMessage("Blog não encontrado"),
        { status: 404 }
      );
    }

    const blog = await updateBlog(blogId, validationResult.data);

    return NextResponse.json(blog, { status: 200 });
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

      if (error.message.includes("Record to update not found")) {
        return NextResponse.json(
          toErrorMessage("Blog não encontrado"),
          { status: 404 }
        );
      }
    }

    return zodErrorHandler(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
    const forbidden = await blockForbiddenRequests(request, adminRoles.DELETE);

    if (forbidden) {
      return forbidden;
    }

    const { blogId } = await params;
    const idValidationResult = objectIdSchema.safeParse(blogId);

    if (!idValidationResult.success) {
      return returnInvalidDataErrors(idValidationResult.error);
    }

    const existingBlog = await getBlogById(blogId);

    if (!existingBlog) {
      return NextResponse.json(
        toErrorMessage("Blog não encontrado"),
        { status: 404 }
      );
    }

    const blog = await deleteBlog(blogId);

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    if (error instanceof Error) {
      if (error.message.includes("Record to delete does not exist")) {
        return NextResponse.json(
          toErrorMessage("Blog não encontrado"),
          { status: 404 }
        );
      }
    }

    return zodErrorHandler(error);
  }
}
