import { NextRequest, NextResponse } from "next/server";
import {
  deleteBlock,
  getBlockById,
  updateBlock,
} from "@/backend/services/blog-content-blocks";
import {
  objectIdSchema,
  patchBlogContentBlockSchema,
} from "@/backend/schemas";
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

function handleServiceError(error: unknown) {
  if (error instanceof NextResponse) {
    return error;
  }

  if (error instanceof Error) {
    if (error.message.includes("Bloco não encontrado")) {
      return NextResponse.json(
        toErrorMessage("Bloco não encontrado"),
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
  { params }: { params: Promise<{ blogId: string; blockId: string }> }
) {
  try {
    const { blogId, blockId } = await params;

    const blogIdValidation = objectIdSchema.safeParse(blogId);
    const blockIdValidation = objectIdSchema.safeParse(blockId);

    if (!blogIdValidation.success) {
      return returnInvalidDataErrors(blogIdValidation.error);
    }

    if (!blockIdValidation.success) {
      return returnInvalidDataErrors(blockIdValidation.error);
    }

    const block = await getBlockById(blogId, blockId);

    if (!block) {
      return NextResponse.json(
        toErrorMessage("Bloco não encontrado"),
        { status: 404 }
      );
    }

    return NextResponse.json(block, { status: 200 });
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string; blockId: string }> }
) {
  try {
    const forbidden = await blockForbiddenRequests(request, adminRoles.PATCH);

    if (forbidden) {
      return forbidden;
    }

    const { blogId, blockId } = await params;

    const blogIdValidation = objectIdSchema.safeParse(blogId);
    const blockIdValidation = objectIdSchema.safeParse(blockId);

    if (!blogIdValidation.success) {
      return returnInvalidDataErrors(blogIdValidation.error);
    }

    if (!blockIdValidation.success) {
      return returnInvalidDataErrors(blockIdValidation.error);
    }

    const body = await validBody(request);
    const validationResult = patchBlogContentBlockSchema.safeParse(body);

    if (!validationResult.success) {
      return returnInvalidDataErrors(validationResult.error);
    }

    const block = await updateBlock(blogId, blockId, validationResult.data);

    return NextResponse.json(block, { status: 200 });
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string; blockId: string }> }
) {
  try {
    const forbidden = await blockForbiddenRequests(request, adminRoles.DELETE);

    if (forbidden) {
      return forbidden;
    }

    const { blogId, blockId } = await params;

    const blogIdValidation = objectIdSchema.safeParse(blogId);
    const blockIdValidation = objectIdSchema.safeParse(blockId);

    if (!blogIdValidation.success) {
      return returnInvalidDataErrors(blogIdValidation.error);
    }

    if (!blockIdValidation.success) {
      return returnInvalidDataErrors(blockIdValidation.error);
    }

    const block = await deleteBlock(blogId, blockId);

    return NextResponse.json(block, { status: 200 });
  } catch (error) {
    return handleServiceError(error);
  }
}
