export const createLessonVariant = async (
  lessonId: string,
  newVariantName: string,
  newVariantSlug: string,
  newVariantDescription?: string,
  newVariantIsDefault?: boolean,
  newVariantWeight?: number,
  newVariantIsActive?: boolean
) => {
  return fetch(`/api/lessons/${lessonId}/variants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: newVariantName,
      slug: newVariantSlug,
      description: newVariantDescription || undefined,
      isDefault: newVariantIsDefault || undefined,
      weight: newVariantWeight ?? undefined,
      isActive: newVariantIsActive || undefined,
    }),
  });
}      