export type Artwork = {
  slug: string;
  title: string;
  artist: string;
  artistSlug: string;
  category: string;
  medium: string;
  year: number;
  price?: number;
  dimensions: string;
  image: string;
  color: string;
  description: string;
  featured?: boolean;
};

const image = (id: string, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const artworks: Artwork[] = [
  {
    slug: "echoes-in-blue",
    title: "Echoes in Blue",
    artist: "Mara Sol",
    artistSlug: "mara-sol",
    category: "Painting",
    medium: "Oil on linen",
    year: 2025,
    price: 840,
    dimensions: "60 × 80 cm",
    image: image("photo-1541961017774-22349e4a1262"),
    color: "#b5c8dc",
    description:
      "A quiet study of memory and the shifting space between what we know and what we feel. Layered blues reveal themselves slowly, like a familiar place seen in a different light.",
    featured: true,
  },
  {
    slug: "the-quiet-garden",
    title: "The Quiet Garden",
    artist: "Noah Williams",
    artistSlug: "noah-williams",
    category: "Photography",
    medium: "Archival pigment print",
    year: 2024,
    dimensions: "40 × 50 cm",
    image: image("photo-1470252649378-9c29740c9fa8"),
    color: "#bbc2a1",
    description:
      "An early morning garden, photographed just before the day begins. The work is part of an ongoing series about attention and the landscapes we return to.",
    featured: true,
  },
  {
    slug: "fragments-of-tomorrow",
    title: "Fragments of Tomorrow",
    artist: "Ari Chen",
    artistSlug: "ari-chen",
    category: "Digital Art",
    medium: "Digital collage, archival print",
    year: 2025,
    price: 320,
    dimensions: "50 × 70 cm",
    image: image("photo-1549490349-8643362247b5"),
    color: "#e5aa83",
    description:
      "Found textures and imagined landscapes meet in a collage about optimism, uncertainty, and the places we have not reached yet.",
    featured: true,
  },
  {
    slug: "solstice-no-04",
    title: "Solstice No. 04",
    artist: "Mara Sol",
    artistSlug: "mara-sol",
    category: "Abstract Art",
    medium: "Acrylic and graphite",
    year: 2024,
    price: 1120,
    dimensions: "70 × 90 cm",
    image: image("photo-1579783902614-a3fb3927b6a5"),
    color: "#c5b7d2",
    description:
      "The fourth painting in a series tracing the changing color of late afternoon through a single summer.",
    featured: true,
  },
  {
    slug: "a-study-in-motion",
    title: "A Study in Motion",
    artist: "Ari Chen",
    artistSlug: "ari-chen",
    category: "Illustration",
    medium: "Ink and watercolor on paper",
    year: 2023,
    price: 280,
    dimensions: "30 × 42 cm",
    image: image("photo-1578301978693-85fa9c0320b9"),
    color: "#d8b690",
    description:
      "Loose marks and careful pauses capture a fleeting gesture. Made slowly, in a series of short sessions over the course of a month.",
    featured: true,
  },
  {
    slug: "somewhere-between-dreams",
    title: "Somewhere Between Dreams",
    artist: "Leila Okafor",
    artistSlug: "leila-okafor",
    category: "Mixed Media",
    medium: "Paper, thread, natural pigment",
    year: 2025,
    dimensions: "45 × 60 cm",
    image: image("photo-1547826039-bfc35e0f1ea8"),
    color: "#cda4a0",
    description:
      "A tactile composition built from collected papers and hand-dyed thread, exploring how stories travel through generations.",
    featured: true,
  },
  {
    slug: "soft-architecture",
    title: "Soft Architecture",
    artist: "Leila Okafor",
    artistSlug: "leila-okafor",
    category: "Sculpture",
    medium: "Hand-built ceramic",
    year: 2024,
    price: 460,
    dimensions: "24 × 18 × 16 cm",
    image: image("photo-1578749556568-bc2c40e68b61"),
    color: "#d8c1aa",
    description:
      "A small ceramic form shaped by the idea of shelter: protective, imperfect, and open to the light.",
  },
  {
    slug: "blue-hour-notes",
    title: "Blue Hour Notes",
    artist: "Noah Williams",
    artistSlug: "noah-williams",
    category: "Photography",
    medium: "Digital photograph",
    year: 2025,
    dimensions: "30 × 40 cm",
    image: image("photo-1518837695005-2083093ee35b"),
    color: "#9bb9cb",
    description:
      "A shoreline at the edge of evening, where the last light briefly turns ordinary water into something unfamiliar.",
  },
];

export const categories = [
  { name: "Painting", image: image("photo-1579783902614-a3fb3927b6a5", 700), count: 124 },
  { name: "Digital Art", image: image("photo-1549490349-8643362247b5", 700), count: 86 },
  { name: "Illustration", image: image("photo-1578301978693-85fa9c0320b9", 700), count: 92 },
  { name: "Photography", image: image("photo-1470252649378-9c29740c9fa8", 700), count: 67 },
  { name: "Sculpture", image: image("photo-1578749556568-bc2c40e68b61", 700), count: 38 },
  { name: "Abstract Art", image: image("photo-1541961017774-22349e4a1262", 700), count: 105 },
  { name: "Mixed Media", image: image("photo-1547826039-bfc35e0f1ea8", 700), count: 51 },
  { name: "Typography", image: image("photo-1549490349-8643362247b5", 700), count: 29 },
];

export const artists = [
  {
    slug: "mara-sol",
    name: "Mara Sol",
    location: "Lisbon, Portugal",
    medium: "Painter & color researcher",
    bio: "Mara makes thoughtful, color-led paintings inspired by shifting light and the small rituals of everyday life.",
    image: image("photo-1534528741775-53994a69daeb", 500),
    works: 18,
  },
  {
    slug: "ari-chen",
    name: "Ari Chen",
    location: "Brooklyn, New York",
    medium: "Digital artist & illustrator",
    bio: "Ari combines digital collage, found materials, and playful mark-making to imagine near-future landscapes.",
    image: image("photo-1500648767791-00dcc994a43e", 500),
    works: 24,
  },
  {
    slug: "leila-okafor",
    name: "Leila Okafor",
    location: "London, United Kingdom",
    medium: "Multidisciplinary artist",
    bio: "Leila works across ceramics, textiles, and paper to explore memory, home, and inherited stories.",
    image: image("photo-1531123897727-8f129e1688ce", 500),
    works: 12,
  },
  {
    slug: "noah-williams",
    name: "Noah Williams",
    location: "Copenhagen, Denmark",
    medium: "Photographer",
    bio: "Noah photographs quiet places and the ways people shape, care for, and return to them.",
    image: image("photo-1506794778202-cad84cf45f1d", 500),
    works: 31,
  },
];

export const collections = [
  { slug: "art-for-slow-living", title: "Art for Slow Living", description: "Soft colors, quiet rooms, and the beauty of taking your time.", count: 18, image: image("photo-1494438639946-1ebd1d20bf85", 1000), label: "A MOMENT TO PAUSE" },
  { slug: "new-voices", title: "New Voices", description: "Meet the artists shifting the conversation, one work at a time.", count: 24, image: image("photo-1579783902614-a3fb3927b6a5", 1000), label: "THE NEXT GENERATION" },
  { slug: "beyond-the-canvas", title: "Beyond the Canvas", description: "Unexpected materials and ideas that refuse to stay in one frame.", count: 16, image: image("photo-1547826039-bfc35e0f1ea8", 1000), label: "MATERIAL MATTERS" },
  { slug: "color-in-motion", title: "Color in Motion", description: "A lively study of movement, energy, and vivid color.", count: 20, image: image("photo-1549490349-8643362247b5", 1000), label: "FEEL THE COLOR" },
];
