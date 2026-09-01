import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const pages = [
  {
    slug: "home",
    order: 0,
    fr: {
      title: "Utopix",
      content:
        "Utopix est la trace visible du cheminement patient et passionné de Jo Pillet et de sa famille : une habitation-sculpture, des espaces d'exposition intérieurs et extérieurs, des sculptures-jeux. Tout est à observer, à découvrir, à expérimenter.\n\nLe lieu se trouve sur la commune de Sainte-Énimie, sur le Causse de Sauveterre, en Lozère.",
    },
    en: {
      title: "Utopix",
      content:
        "Utopix is the visible trace of the patient, passionate journey of Jo Pillet and his family: a sculpture-house, indoor and outdoor exhibition spaces, playful sculptures. Everything is meant to be observed, discovered, experienced.\n\nThe site is located in the commune of Sainte-Énimie, on the Causse de Sauveterre, in Lozère, France.",
    },
  },
  {
    slug: "histoire",
    order: 1,
    fr: {
      title: "Histoire",
      content:
        "Utopix est né du geste patient d'un homme, Jo Pillet, qui a façonné année après année un lieu de vie devenu œuvre à part entière.\n\nAu fil des décennies, la maison s'est transformée, augmentée, sculptée, jusqu'à devenir une habitation-sculpture indissociable du paysage du Causse.",
    },
    en: {
      title: "History",
      content:
        "Utopix was born from the patient work of one man, Jo Pillet, who shaped, year after year, a living space that became a work of art in its own right.\n\nOver the decades, the house transformed, grew and was sculpted until it became a sculpture-house inseparable from the landscape of the Causse.",
    },
  },
  {
    slug: "construction",
    order: 2,
    fr: {
      title: "Construction",
      content:
        "Une construction artisanale, pensée et bâtie à la main, avec des matériaux locaux et de récupération.\n\nChaque mur, chaque courbe, chaque escalier raconte une étape du chantier permanent qu'a été Utopix.",
    },
    en: {
      title: "Construction",
      content:
        "A handmade construction, designed and built by hand, using local and reclaimed materials.\n\nEvery wall, every curve, every staircase tells a chapter of the ongoing building site that Utopix has always been.",
    },
  },
  {
    slug: "exterieur",
    order: 3,
    fr: {
      title: "Extérieur(s)",
      content:
        "Les espaces extérieurs se déploient comme un parcours d'exposition à ciel ouvert : sculptures-jeux, structures et installations dialoguent avec le relief du Causse de Sauveterre.",
    },
    en: {
      title: "Exterior(s)",
      content:
        "The outdoor spaces unfold like an open-air exhibition trail: playful sculptures, structures and installations that engage in dialogue with the relief of the Causse de Sauveterre.",
    },
  },
  {
    slug: "interieur",
    order: 4,
    fr: {
      title: "Intérieur(s)",
      content:
        "À l'intérieur, les pièces d'habitation se prolongent en espaces d'exposition : peintures, sculptures et objets composent un univers habité, dense et singulier.",
    },
    en: {
      title: "Interior(s)",
      content:
        "Inside, the living spaces extend into exhibition areas: paintings, sculptures and objects compose a dense and singular inhabited universe.",
    },
  },
  {
    slug: "peintures",
    order: 5,
    fr: {
      title: "Peintures",
      content:
        "Une œuvre peinte foisonnante, nourrie d'années d'observation et d'expérimentation, qui accompagne et prolonge le travail de sculpture.",
    },
    en: {
      title: "Paintings",
      content:
        "A prolific body of painted work, nourished by years of observation and experimentation, accompanying and extending the sculptural practice.",
    },
  },
  {
    slug: "sculptures",
    order: 6,
    fr: {
      title: "Sculptures",
      content:
        "Des sculptures à observer, à découvrir, à expérimenter : certaines sont monumentales, d'autres sont de véritables sculptures-jeux, pensées pour être manipulées et parcourues.",
    },
    en: {
      title: "Sculptures",
      content:
        "Sculptures to observe, discover and experience: some are monumental, others are playful sculptures designed to be touched and explored.",
    },
  },
  {
    slug: "infos",
    order: 7,
    fr: {
      title: "Infos - Extras",
      content:
        "Utopix n'est plus ouvert au public.\n\nCette page rassemble les informations pratiques et complémentaires sur le lieu.",
    },
    en: {
      title: "Infos - Extras",
      content:
        "Utopix is no longer open to the public.\n\nThis page gathers practical and additional information about the site.",
    },
  },
  {
    slug: "contact",
    order: 8,
    fr: {
      title: "Accès - Contact",
      content:
        "Utopix se situe sur la commune de Sainte-Énimie, sur le Causse de Sauveterre, en Lozère.\n\nLe site n'est plus ouvert au public.",
    },
    en: {
      title: "Access - Contact",
      content:
        "Utopix is located in the commune of Sainte-Énimie, on the Causse de Sauveterre, in Lozère, France.\n\nThe site is no longer open to the public.",
    },
  },
];

async function main() {
  for (const page of pages) {
    const created = await prisma.page.upsert({
      where: { slug: page.slug },
      update: { order: page.order },
      create: { slug: page.slug, order: page.order },
    });

    for (const locale of ["fr", "en"] as const) {
      const t = page[locale];
      await prisma.pageTranslation.upsert({
        where: { pageId_locale: { pageId: created.id, locale } },
        update: { title: t.title, content: t.content },
        create: {
          pageId: created.id,
          locale,
          title: t.title,
          content: t.content,
        },
      });
    }
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "syl.pillet@hotmail.fr";
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const password = randomBytes(9).toString("base64url");
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.adminUser.create({
      data: { email: adminEmail, passwordHash },
    });
    console.log("\n=== Compte admin créé ===");
    console.log(`Email    : ${adminEmail}`);
    console.log(`Password : ${password}`);
    console.log("Change ce mot de passe après la première connexion.\n");
  } else {
    console.log(`Admin ${adminEmail} existe déjà, aucun changement.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
