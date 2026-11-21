// EVERY image slot on the site lives here. To use a real photo, edit one line:
// put the new file in /public/images/ (or a full URL), set `src`, write `alt`, and set
// `placeholder: false`. Then add a row to src/assets/images/SOURCES.md.
//
// placeholder: true  = sample stock photo, shows a visible "Sample photo" tag and makes
//                      `npm run check:launch` fail. Never caption one as an ECM job.
// src: ''            = no photo yet, shows a plain gray "Photo coming" block.

import heroDiamondHead from '../assets/images/hero-diamond-head.jpg';
import ecmLogo from '../assets/images/ecm-logo.png';

const unsplash = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format`;

export type ImageSlot = {
  src: string;
  alt: string;
  placeholder: boolean;
  width: number;
  height: number;
};

// Local, optimized by Astro's Image component.
export const logo = { src: ecmLogo, alt: 'Elite Construction Management logo' };
// Hero: origin unknown, draft use only until Jesse confirms (see SOURCES.md).
export const hero = { src: heroDiamondHead, alt: 'Diamond Head and the Honolulu coastline', placeholder: true };

export const photos: Record<string, ImageSlot> = {
  home:       { src: unsplash('photo-1791882895731-a46380dc545e', 1600), alt: 'Sample photo of a house', placeholder: true, width: 1600, height: 1067 },
  adu:        { src: unsplash('photo-1774847408513-bebd160c419a', 1600), alt: 'Sample photo of a small detached home', placeholder: true, width: 1600, height: 1067 },
  kitchen:    { src: unsplash('photo-1617228069096-4638a7ffc906', 1600), alt: 'Sample photo of a kitchen', placeholder: true, width: 1600, height: 1067 },
  bathroom:   { src: unsplash('photo-1763485956310-55f3c0e822d5', 1600), alt: 'Sample photo of a bathroom', placeholder: true, width: 1600, height: 1067 },
  commercial: { src: unsplash('photo-1758448500688-3ababa93fd67', 1600), alt: 'Sample photo of a commercial space', placeholder: true, width: 1600, height: 1067 },
  framing:    { src: unsplash('photo-1777105939822-21228c81916d', 1600), alt: 'Sample photo of house framing', placeholder: true, width: 1600, height: 1067 },
  crew:       { src: unsplash('photo-1587582423116-ec07293f0395', 1600), alt: 'Sample photo of a construction crew', placeholder: true, width: 1600, height: 1067 },
  // Real ECM photos only, with the owner's written OK. Empty until then.
  about:      { src: '', alt: '', placeholder: false, width: 1600, height: 900 },
};

// Smaller versions of the same placeholders for cards.
export const cardSrc = (key: string) => {
  const p = photos[key];
  return p && p.placeholder && p.src.includes('images.unsplash.com') ? p.src.replace('w=1600', 'w=800') : p?.src ?? '';
};

// Home page slider, in order.
export const sliderKeys = ['home', 'adu', 'kitchen', 'bathroom', 'commercial', 'framing'];
