// EVERY image slot on the site lives here. To change a photo, edit one line.
//
// Local photos (ECM job photos) are imported and optimized by Astro's Image component.
// Remote sample photos are plain URLs.
//   placeholder: true  = sample stock photo. Shows a visible "Sample photo" tag and makes
//                        `npm run check:launch` fail. Never caption one as an ECM job.
//   src: ''            = no photo yet, shows a plain gray block.
// Every image used must have a row in src/assets/images/SOURCES.md.

import type { ImageMetadata } from 'astro';
import heroDiamondHead from '../assets/images/hero-diamond-head.jpg';
import ecmLogo from '../assets/images/ecm-logo.png';

import acsExterior from '../assets/images/projects/acs-hope-lodge-exterior.jpg';
import acsSign from '../assets/images/projects/acs-hope-lodge-sign.jpg';
import acsCeiling1 from '../assets/images/projects/acs-hope-lodge-ceiling-repair-1.jpg';
import acsCeiling2 from '../assets/images/projects/acs-hope-lodge-ceiling-repair-2.jpg';
import acsPergola1 from '../assets/images/projects/acs-hope-lodge-pergola-1.jpg';
import acsPergola2 from '../assets/images/projects/acs-hope-lodge-pergola-2.jpg';
import bambooBefore from '../assets/images/projects/bamboo-floor-before.jpg';
import bambooAfter from '../assets/images/projects/bamboo-floor-after.jpg';
import walk1 from '../assets/images/projects/concrete-walkway-1.jpg';
import walk2 from '../assets/images/projects/concrete-walkway-2.jpg';
import walk3 from '../assets/images/projects/concrete-walkway-3.jpg';
import drivewayBefore from '../assets/images/projects/driveway-salt-lake-before.jpg';
import drivewayDuring from '../assets/images/projects/driveway-salt-lake-during.jpg';
import longs1 from '../assets/images/projects/longs-drip-edge-1.jpg';
import longs2 from '../assets/images/projects/longs-drip-edge-2.jpg';
import longs3 from '../assets/images/projects/longs-drip-edge-3.jpg';
import longsBefore from '../assets/images/projects/longs-drip-edge-before.jpg';
import longsAfter from '../assets/images/projects/longs-drip-edge-after.jpg';

const unsplash = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format`;

export type ImageSlot = {
  src: ImageMetadata | string;
  alt: string;
  placeholder: boolean;
  /** CSS object-position for crops, e.g. 'bottom'. */
  position?: string;
  /** Intrinsic size for remote images (local ones carry their own). */
  width?: number;
  height?: number;
};

// Local, optimized by Astro's Image component.
export const logo = { src: ecmLogo, alt: 'Elite Construction Management logo' };
// Hero: origin unknown, draft use only until Jesse confirms (see SOURCES.md).
export const hero = { src: heroDiamondHead, alt: 'Diamond Head and the Honolulu coastline', placeholder: true };

const job = (src: ImageMetadata, alt: string, position?: ImageSlot['position']): ImageSlot => ({ src, alt, placeholder: false, position });
const stock = (id: string, alt: string): ImageSlot => ({ src: unsplash(id, 1600), alt, placeholder: true, width: 1600, height: 1067 });

export const photos: Record<string, ImageSlot> = {
  // ECM job photos (SOURCES.md: "ECM job photos").
  acsExterior:    job(acsExterior, 'American Cancer Society Clarence T.C. Ching Hope Lodge building in Honolulu'),
  acsSign:        job(acsSign, 'American Cancer Society Hope Lodge sign on the building', 'upper'),
  acsCeiling1:    job(acsCeiling1, 'Open ceiling section during interior restoration and ceiling work at Hope Lodge', 'top'),
  acsCeiling2:    job(acsCeiling2, 'Finished ceiling panel after interior restoration and ceiling work at Hope Lodge', 'top'),
  pergola1:       job(acsPergola1, 'Aluminum pergola system being installed on the Hope Lodge terrace', 'lower'),
  pergolaView:    job(acsPergola2, 'Aluminum pergola frame at Hope Lodge with a view over Honolulu', 'upper'),
  bambooBefore:   job(bambooBefore, 'Kaneohe residence before the bamboo floor remodel, bare concrete floor', 'lower'),
  bambooAfter:    job(bambooAfter, 'Kaneohe residence after the bamboo floor remodel', 'lower'),
  walk1:          job(walk1, 'Garden courtyard with a concrete walkway', 'bottom'),
  walk2:          job(walk2, 'Concrete walkway forms and rebar set in a garden courtyard', 'lower'),
  walk3:          job(walk3, 'Crew finishing the concrete walkway pour', 'lower'),
  drivewayBefore: job(drivewayBefore, 'Salt Lake residence before the concrete driveway, gravel lot', 'lower'),
  drivewayDuring: job(drivewayDuring, 'Crew pouring the concrete driveway and walkway at a Salt Lake residence', 'center'),
  longsBefore:    job(longsBefore, 'Longs Drugs store roof edge before the metal drip edge replacement', 'upper'),
  longsAfter:     job(longsAfter, 'Longs Drugs store roof edge after the metal drip edge replacement', 'upper'),
  longs1:         job(longs1, 'Longs Drugs store roof edge during the metal drip edge replacement', 'upper'),
  longsStore:     job(longs2, 'Longs Drugs store front with the new metal drip edge', 'upper'),
  longsSign:      job(longs3, 'Longs Drugs sign below the roof edge during drip edge replacement', 'top'),

  // Sample stock photos: only where no real ECM photo fits yet.
  home:     stock('photo-1791882895731-a46380dc545e', 'Sample photo of a house'),
  adu:      stock('photo-1774847408513-bebd160c419a', 'Sample photo of a small detached home'),
  kitchen:  stock('photo-1617228069096-4638a7ffc906', 'Sample photo of a kitchen'),
  bathroom: stock('photo-1763485956310-55f3c0e822d5', 'Sample photo of a bathroom'),
};

// Home page photo slider, in order (all ECM job photos).
export const sliderKeys = ['pergola1', 'longsStore', 'bambooAfter', 'walk3', 'drivewayDuring', 'acsSign', 'longsAfter'];
