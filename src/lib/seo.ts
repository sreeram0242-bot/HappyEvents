/**
 * SEO & Local Business Structured Data for Happy Events Karur
 */

export const SEO_DATA = {
  title: "Happy Events Karur — Best Event Management & Wedding Planners in Karur",
  siteName: "Happy Events Karur",
  tagline: "Premier Event Management & Wedding Planning in Karur, Tamil Nadu",
  description:
    "Happy Events is Karur's #1 event management service led by Vijay. Specializing in luxury weddings, college fests, birthdays, stage decoration, authentic catering, and corporate events in Karur, Trichy, Erode, and Tamil Nadu. Call +91 96266 10819 for quotes.",
  url: "https://happyeventskarur.com",
  keywords: [
    "happy events",
    "happy events karur",
    "events in karur",
    "event management in karur",
    "best event management company in karur",
    "event planners in karur",
    "wedding planners in karur",
    "marriage event organizers in karur",
    "catering services in karur",
    "wedding catering karur",
    "stage decoration karur",
    "flower decoration in karur",
    "birthday party organizers in karur",
    "college fest organizers karur",
    "corporate event management karur",
    "dj party organizer in karur",
    "happy events vijay",
    "karur events",
    "event organizers near me",
    "tamil nadu event planners",
  ].join(", "),
  phone: "+91 96266 10819",
  email: "happyeventskarur@gmail.com",
  googleVerification: "MDRM73oTpBn3tcy7hHlVkKFq1jtjrZyPGDZscM7MgDg",
  instagram: "https://www.instagram.com/happy_event_karur?igsh=MXZndDFtdzNpNjFheg==",
  facebook: "https://www.facebook.com/share/1bm3wQoYzN/",
};

export const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService", "EntertainmentBusiness"],
  "@id": `${SEO_DATA.url}/#business`,
  name: "Happy Events",
  alternateName: [
    "Happy Events Karur",
    "Happy Event Karur",
    "Happy Events Event Management",
    "Happy Events Wedding Planners Karur",
  ],
  description: SEO_DATA.description,
  url: SEO_DATA.url,
  telephone: "+919626610819",
  email: SEO_DATA.email,
  priceRange: "₹₹",
  image: `${SEO_DATA.url}/favicon.png`,
  logo: `${SEO_DATA.url}/favicon.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Karur City",
    addressLocality: "Karur",
    addressRegion: "Tamil Nadu",
    postalCode: "639001",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "10.9601",
    longitude: "78.0766",
  },
  areaServed: [
    { "@type": "City", name: "Karur" },
    { "@type": "City", name: "Tiruchirappalli" },
    { "@type": "City", name: "Erode" },
    { "@type": "City", name: "Namakkal" },
    { "@type": "City", name: "Dindigul" },
    { "@type": "AdministrativeArea", name: "Tamil Nadu" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "22:00",
    },
  ],
  sameAs: [SEO_DATA.instagram, SEO_DATA.facebook],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Event Management Services in Karur",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Wedding Planning & Management in Karur",
          description:
            "Complete wedding organizing, pre-wedding rituals (Haldi, Mehendi, Sangeet), reception decor, and guest hospitality in Karur and across Tamil Nadu.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Catering Services in Karur",
          description:
            "Authentic South Indian & multi-cuisine vegetarian and non-vegetarian catering for weddings, receptions, and private parties in Karur.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Stage & Floral Decoration in Karur",
          description:
            "Custom luxury backdrop themes, traditional floral decor, LED lighting, and mandap decoration in Karur.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "College Fests & Cultural Events in Karur",
          description:
            "Large-scale college symposiums, annual day functions, pro-nights, celebrity coordination, and concert sound setups.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Birthday Party Planning in Karur",
          description:
            "Themed 1st birthdays, milestone celebrations, balloon decors, game anchors, and surprise party coordination in Karur.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Corporate Events & Showroom Inaugurations in Karur",
          description:
            "Store openings, brand launches, annual galas, conferences, audio-visual setups, and VIP hospitality in Karur.",
        },
      },
    ],
  },
};

export const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the best event management company in Karur?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Happy Events (led by Vijay) is the top-rated event management service in Karur, offering complete wedding planning, catering, stage decoration, college fests, and corporate event management.",
      },
    },
    {
      "@type": "Question",
      name: "What event management services does Happy Events offer in Karur?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Happy Events provides end-to-end event planning including authentic South Indian & multi-cuisine catering, stage and floral decoration, birthday party planning, college cultural fests, corporate inaugurations, DJ sound systems, photography, and bridal assistance.",
      },
    },
    {
      "@type": "Question",
      name: "Do Happy Events organize events outside Karur?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, based in Karur, Happy Events regularly manages grand weddings and celebrations across Tiruchirappalli (Trichy), Namakkal, Erode, Dindigul, and throughout Tamil Nadu.",
      },
    },
    {
      "@type": "Question",
      name: "How can I book or get a quote from Happy Events Karur?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can book directly by calling +91 96266 10819, emailing happyeventskarur@gmail.com, or connecting on WhatsApp for a customized quote tailored to your budget.",
      },
    },
  ],
};
