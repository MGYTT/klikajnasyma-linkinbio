export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type":    "Person",
    name:       "klikajnasyma",
    url:        "https://klikajnasyma.pl",
    sameAs: [
      "https://www.tiktok.com/@klikajnasyma",
      "https://discord.gg/AwaTdZ2Qqg",
    ],
    description: "Twórca treści · TikTok & Discord",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}