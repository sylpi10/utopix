"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Translation = { title: string; content: string };
type ImageItem = { id: number; url: string; altFr: string; altEn: string };

export function PageEditor({
  slug,
  initialFr,
  initialEn,
  initialImages,
}: {
  slug: string;
  initialFr: Translation;
  initialEn: Translation;
  initialImages: ImageItem[];
}) {
  const [tab, setTab] = useState<"fr" | "en">("fr");
  const [fr, setFr] = useState(initialFr);
  const [en, setEn] = useState(initialEn);
  const [images, setImages] = useState(initialImages);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function saveText() {
    setSaving(true);
    setStatus(null);
    const res = await fetch(`/api/admin/pages/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fr, en }),
    });
    setSaving(false);
    setStatus(res.ok ? "Enregistré." : "Erreur lors de l'enregistrement.");
  }

  async function uploadFile(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("slug", slug);
    const res = await fetch("/api/admin/images", {
      method: "POST",
      body: formData,
    });
    setUploading(false);
    if (res.ok) {
      const data = await res.json();
      setImages((prev) => [
        ...prev,
        { id: data.image.id, url: data.image.url, altFr: "", altEn: "" },
      ]);
    } else {
      const data = await res.json().catch(() => ({}));
      setStatus(data.error ?? "Erreur lors de l'envoi de l'image.");
    }
  }

  async function updateAlt(id: number, field: "altFr" | "altEn", value: string) {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, [field]: value } : img)),
    );
    await fetch(`/api/admin/images/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
  }

  async function move(id: number, direction: "up" | "down") {
    const index = images.findIndex((img) => img.id === id);
    if (index === -1) return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= images.length) return;

    const next = [...images];
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    setImages(next);

    await fetch(`/api/admin/images/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ move: direction }),
    });
  }

  async function removeImage(id: number) {
    if (!confirm("Supprimer cette image ?")) return;
    setImages((prev) => prev.filter((img) => img.id !== id));
    await fetch(`/api/admin/images/${id}`, { method: "DELETE" });
  }

  const current = tab === "fr" ? fr : en;
  const setCurrent = tab === "fr" ? setFr : setEn;

  return (
    <div>
      <Link href="/admin" className="text-sm text-ink-soft hover:text-ochre">
        ← Toutes les pages
      </Link>
      <h1 className="mt-2 font-semibold text-xl">Édition — {slug}</h1>

      <section className="mt-8">
        <div className="flex gap-2 border-b border-line">
          {(["fr", "en"] as const).map((locale) => (
            <button
              key={locale}
              onClick={() => setTab(locale)}
              className={`px-4 py-2 text-sm font-medium ${
                tab === locale
                  ? "border-b-2 border-ochre text-ink"
                  : "text-ink-soft"
              }`}
            >
              {locale.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm text-ink-soft">Titre</label>
            <input
              value={current.title}
              onChange={(e) =>
                setCurrent({ ...current, title: e.target.value })
              }
              className="mt-1 w-full rounded border border-line px-3 py-2 outline-none focus:border-ochre"
            />
          </div>
          <div>
            <label className="block text-sm text-ink-soft">
              Contenu (un paragraphe par ligne vide)
            </label>
            <textarea
              value={current.content}
              onChange={(e) =>
                setCurrent({ ...current, content: e.target.value })
              }
              rows={10}
              className="mt-1 w-full rounded border border-line px-3 py-2 outline-none focus:border-ochre"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={saveText}
            disabled={saving}
            className="rounded bg-ink px-4 py-2 text-sm text-paper hover:bg-ochre-dark disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer les textes"}
          </button>
          {status && <span className="text-sm text-ink-soft">{status}</span>}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-semibold">Images / diaporama</h2>

        <div className="mt-4 space-y-4">
          {images.map((img, i) => (
            <div
              key={img.id}
              className="flex flex-col gap-3 rounded border border-line p-3 sm:flex-row"
            >
              <div className="relative h-28 w-full flex-shrink-0 sm:w-40">
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="160px"
                  className="rounded object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <input
                  placeholder="Texte alternatif (FR)"
                  value={img.altFr}
                  onChange={(e) => updateAlt(img.id, "altFr", e.target.value)}
                  className="w-full rounded border border-line px-2 py-1 text-sm outline-none focus:border-ochre"
                />
                <input
                  placeholder="Alt text (EN)"
                  value={img.altEn}
                  onChange={(e) => updateAlt(img.id, "altEn", e.target.value)}
                  className="w-full rounded border border-line px-2 py-1 text-sm outline-none focus:border-ochre"
                />
              </div>
              <div className="flex flex-row gap-2 sm:flex-col">
                <button
                  onClick={() => move(img.id, "up")}
                  disabled={i === 0}
                  className="rounded border border-line px-2 py-1 text-xs disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(img.id, "down")}
                  disabled={i === images.length - 1}
                  className="rounded border border-line px-2 py-1 text-xs disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeImage(img.id)}
                  className="rounded border border-red-200 px-2 py-1 text-xs text-red-600"
                >
                  Suppr.
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file);
              e.target.value = "";
            }}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded border border-line px-4 py-2 text-sm hover:border-ochre disabled:opacity-50"
          >
            {uploading ? "Envoi..." : "+ Ajouter une image"}
          </button>
        </div>
      </section>
    </div>
  );
}
