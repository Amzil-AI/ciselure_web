import { prisma } from "@/lib/prisma";
import GalleryGrid from "./GalleryGrid";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });

  return (
    <div style={{ width: "100%", paddingTop: "80px", paddingBottom: "96px" }}>
      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "0 24px" }}>
        <GalleryGrid images={images} />
      </div>
    </div>
  );
}
