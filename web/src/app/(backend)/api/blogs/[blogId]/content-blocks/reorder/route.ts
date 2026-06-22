import { NextRequest, NextResponse } from "next/server";
import { reorderBlocks } from "@/backend/services/blog-content-blocks";
import {
  objectIdSchema,
  reorderBlogContentBlocksSchema,
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

    if (
      error.message.includes("Bloco não pertence") ||
      error.message.includes("Todos os blocos") ||
      error.message.includes("IDs de blocos duplicados") ||
      error.message.includes("Ordens duplicadas") ||
      error.message.includes("não possui blocos")
    ) {
      return NextResponse.json(toErrorMessage(error.message), { status: 400 });
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
    const validationResult = reorderBlogContentBlocksSchema.safeParse(body);

    if (!validationResult.success) {
      return returnInvalidDataErrors(validationResult.error);
    }

    const blocks = await reorderBlocks(blogId, validationResult.data);

    return NextResponse.json(blocks, { status: 200 });
  } catch (error) {
    return handleServiceError(error);
  }
}
