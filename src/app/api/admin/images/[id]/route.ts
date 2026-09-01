import { NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const id = Number((await params).id);
  const body = await request.json();

  const image = await prisma.pageImage.findUnique({ where: { id } });
  if (!image) {
    return NextResponse.json({ error: "Image introuvable" }, { status: 404 });
  }

  if (body.move === "up" || body.move === "down") {
    const neighbor = await prisma.pageImage.findFirst({
      where: {
        pageId: image.pageId,
        order: body.move === "up" ? { lt: image.order } : { gt: image.order },
      },
      orderBy: { order: body.move === "up" ? "desc" : "asc" },
    });

    if (neighbor) {
      await prisma.$transaction([
        prisma.pageImage.update({
          where: { id: image.id },
          data: { order: neighbor.order },
        }),
        prisma.pageImage.update({
          where: { id: neighbor.id },
          data: { order: image.order },
        }),
      ]);
    }
  }

  if (typeof body.altFr === "string" || typeof body.altEn === "string") {
    await prisma.pageImage.update({
      where: { id },
      data: {
        ...(typeof body.altFr === "string" ? { altFr: body.altFr } : {}),
        ...(typeof body.altEn === "string" ? { altEn: body.altEn } : {}),
      },
    });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const id = Number((await params).id);
  const image = await prisma.pageImage.findUnique({ where: { id } });
  if (!image) {
    return NextResponse.json({ error: "Image introuvable" }, { status: 404 });
  }

  await prisma.pageImage.delete({ where: { id } });

  if (image.url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", image.url);
    await unlink(filePath).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
