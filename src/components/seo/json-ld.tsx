import Script from "next/script";

interface OrganizationJsonLdProps {
  url?: string;
  logo?: string;
  name?: string;
}

export function OrganizationJsonLd({
  url = "https://glambook.in",
  logo = "https://glambook.in/icon.png",
  name = "GlamBook",
}: OrganizationJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description:
      "India's premier luxury bridal and event styling network connecting clients with verified makeup artists and photographers.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-98765-43210",
      contactType: "Customer Concierge",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [
      "https://instagram.com/glambook",
      "https://pinterest.com/glambook",
      "https://facebook.com/glambook",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface WebsiteJsonLdProps {
  url?: string;
}

export function WebsiteJsonLd({ url = "https://glambook.in" }: WebsiteJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GlamBook",
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/artists?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  item: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
