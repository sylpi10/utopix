import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PAGE_SLUGS, HOME_SLUG } from "@/lib/page-slugs";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const pages = await prisma.page.findMany({
    where: { slug: { in: [HOME_SLUG, ...PAGE_SLUGS] } },
    include: {
      translations: true,
      _count: { select: { images: true } },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-xl">Pages du site</h1>
        <Link
          href="/admin/account"
          className="text-sm text-ink-soft underline underline-offset-2 hover:text-ochre"
        >
          Mon compte
        </Link>
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Modifie les textes (FR/EN) et les images de chaque section.
      </p>

      <div className="mt-8 divide-y divide-line border-y border-line">
        {pages.map((page) => {
          const fr = page.translations.find((t) => t.locale === "fr");
          return (
            <Link
              key={page.slug}
              href={`/admin/pages/${page.slug}`}
              className="flex items-center justify-between py-4 hover:bg-paper-dim"
            >
              <div>
                <p className="font-medium">{fr?.title ?? page.slug}</p>
                <p className="text-xs text-ink-soft">/{page.slug}</p>
              </div>
              <p className="text-sm text-ink-soft">
                {page._count.images} image(s)
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
