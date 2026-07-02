import { prisma } from "@/lib/prisma";
import GalleryGrid from "./GalleryGrid";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", paddingTop: "80px", paddingBottom: "96px" }}>
      <div style={{ width: "100%", maxWidth: "520px", padding: "0 24px" }}>
        <GalleryGrid images={images} />
      </div>
    </div>
  );
}
