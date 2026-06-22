import { NextRequest, NextResponse } from "next/server";
import {
  createBlock,
  getBlocksByBlogId,
} from "@/backend/services/blog-content-blocks";
import { createBlogContentBlockSchema, objectIdSchema } from "@/backend/schemas";
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

function handleServiceError(error: unknown) {
  if (error instanceof NextResponse) {
    return error;
  }

  if (error instanceof Error) {
    if (error.message.includes("Blog não encontrado")) {
      return NextResponse.json(
        toErrorMessage("Blog não encontrado"),
        { status: 404 }
      );
    }

    if (error.message.includes("Unique constraint")) {
      return NextResponse.json(
        toErrorMessage("Conflito de ordem entre blocos do blog"),
        { status: 409 }
      );
    }
  }

  return zodErrorHandler(error);
}

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

    const blocks = await getBlocksByBlogId(blogId);

    return NextResponse.json(blocks, { status: 200 });
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
    const forbidden = await blockForbiddenRequests(request, adminRoles.POST);

    if (forbidden) {
      return forbidden;
    }

    const { blogId } = await params;
    const idValidationResult = objectIdSchema.safeParse(blogId);

    if (!idValidationResult.success) {
      return returnInvalidDataErrors(idValidationResult.error);
    }

    const body = await validBody(request);
    const validationResult = createBlogContentBlockSchema.safeParse(body);

    if (!validationResult.success) {
      return returnInvalidDataErrors(validationResult.error);
    }

    const block = await createBlock(blogId, validationResult.data);

    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    return handleServiceError(error);
  }
}
