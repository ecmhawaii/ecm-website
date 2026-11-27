// EVERY image slot on the site lives here. To change a photo, edit one line.
//
// Local photos (ECM job photos) are imported and optimized by Astro's Image component.
// Remote photos (plain URLs) are still supported by PhotoSlot, but none are used: every slot is
// an ECM job photo since 2026-11-23.
//   placeholder: true  = sample stock photo. Shows a visible "Sample photo" tag and makes
//                        `npm run check:launch` fail. Never caption one as an ECM job.
//   src: ''            = no photo yet, shows a plain gray block.
// Every image used must have a row in src/assets/images/SOURCES.md.

import type { ImageMetadata } from 'astro';
import ecmLogo from '../assets/images/ecm-logo.png';

import acsExterior from '../assets/images/projects/acs-hope-lodge-exterior.jpg';
import acsSign from '../assets/images/projects/acs-hope-lodge-sign.jpg';
import acsCeiling1 from '../assets/images/projects/acs-hope-lodge-ceiling-repair-1.jpg';
import acsCeiling2 from '../assets/images/projects/acs-hope-lodge-ceiling-repair-2.jpg';
import acsPergola2 from '../assets/images/projects/acs-hope-lodge-pergola-2.jpg';
import bambooBefore from '../assets/images/projects/bamboo-floor-before.jpg';
import bambooAfter from '../assets/images/projects/bamboo-floor-after.jpg';
// Re-framed to line up with the before photo, for the compare slider only (Ellard, 2026-11-25).
import bambooAfterAligned from '../assets/images/projects/bamboo-floor-after-aligned.jpg';
import walk1 from '../assets/images/projects/concrete-walkway-1.jpg';
import walk2 from '../assets/images/projects/concrete-walkway-2.jpg';
import drivewayBefore from '../assets/images/projects/driveway-salt-lake-before.jpg';
// Re-framed to line up with the during photo, for the compare slider only (Ellard, 2026-11-25).
import drivewayBeforeAligned from '../assets/images/projects/driveway-salt-lake-before-aligned.jpg';
import drivewayDuring from '../assets/images/projects/driveway-salt-lake-during.jpg';
import longs1 from '../assets/images/projects/longs-drip-edge-1.jpg';
import longs2 from '../assets/images/projects/longs-drip-edge-2.jpg';
import longs3 from '../assets/images/projects/longs-drip-edge-3.jpg';
import longsBefore from '../assets/images/projects/longs-drip-edge-before.jpg';
import longsAfter from '../assets/images/projects/longs-drip-edge-after.jpg';

// ECM job photos, set 2 (SOURCES.md): Big Island new homes and a second Waianae remodel.
import hawaiiIslandNewHomeBarnDoor from '../assets/images/projects/hawaii-island-new-home-barn-door.jpg';
import hawaiiIslandNewHomeBathroom1 from '../assets/images/projects/hawaii-island-new-home-bathroom-1.jpg';
import hawaiiIslandNewHomeDoubleVanity from '../assets/images/projects/hawaii-island-new-home-double-vanity.jpg';
import hawaiiIslandNewHomeEntry from '../assets/images/projects/hawaii-island-new-home-entry.jpg';
import hawaiiIslandNewHomeExterior1 from '../assets/images/projects/hawaii-island-new-home-exterior-1.jpg';
import hawaiiIslandNewHomeExterior2 from '../assets/images/projects/hawaii-island-new-home-exterior-2.jpg';
import hawaiiIslandNewHomeExterior3 from '../assets/images/projects/hawaii-island-new-home-exterior-3.jpg';
import hawaiiIslandNewHomeExterior4 from '../assets/images/projects/hawaii-island-new-home-exterior-4.jpg';
import hawaiiIslandNewHomeGreatRoom1 from '../assets/images/projects/hawaii-island-new-home-great-room-1.jpg';
import hawaiiIslandNewHomeGreatRoom2 from '../assets/images/projects/hawaii-island-new-home-great-room-2.jpg';
import hawaiiIslandNewHomeKitchen1 from '../assets/images/projects/hawaii-island-new-home-kitchen-1.jpg';
import hawaiiIslandNewHomeKitchen2 from '../assets/images/projects/hawaii-island-new-home-kitchen-2.jpg';
import hawaiiIslandNewHomeKitchen3 from '../assets/images/projects/hawaii-island-new-home-kitchen-3.jpg';
import hawaiiIslandNewHomeLivingDining from '../assets/images/projects/hawaii-island-new-home-living-dining.jpg';
import hawaiiIslandNewHomeShower from '../assets/images/projects/hawaii-island-new-home-shower.jpg';
import waianaeRemodel2Kitchen from '../assets/images/projects/waianae-remodel-2-kitchen.jpg';
import waianaeRemodel2Shower from '../assets/images/projects/waianae-remodel-2-shower.jpg';

// ECM job photos from a repeat client's investment properties (SOURCES.md), Waianae and Mililani.
import mililaniBathroom1 from '../assets/images/projects/mililani-bathroom-1.jpg';
import mililaniBathroom2 from '../assets/images/projects/mililani-bathroom-2.jpg';
import mililaniKitchen1 from '../assets/images/projects/mililani-kitchen-1.jpg';
import mililaniKitchen2 from '../assets/images/projects/mililani-kitchen-2.jpg';
import mililaniRemodelDiningKitchen from '../assets/images/projects/mililani-remodel-dining-kitchen.jpg';
import mililaniRemodelLivingRoom from '../assets/images/projects/mililani-remodel-living-room.jpg';
import waianaeAdditionFraming1 from '../assets/images/projects/waianae-addition-framing-1.jpg';
import waianaeAdditionFraming2 from '../assets/images/projects/waianae-addition-framing-2.jpg';
import waianaeAdditionFraming3 from '../assets/images/projects/waianae-addition-framing-3.jpg';
import waianaeAdditionHouseWrap from '../assets/images/projects/waianae-addition-house-wrap.jpg';
import waianaeAdditionRoof from '../assets/images/projects/waianae-addition-roof.jpg';
import waianaeAdditionSidingDone from '../assets/images/projects/waianae-addition-siding-done.jpg';
import waianaeBathroomAfter1 from '../assets/images/projects/waianae-bathroom-after-1.jpg';
import waianaeBathroomAfter2 from '../assets/images/projects/waianae-bathroom-after-2.jpg';
import waianaeBathroomBefore1 from '../assets/images/projects/waianae-bathroom-before-1.jpg';
import waianaeBathroomBefore2 from '../assets/images/projects/waianae-bathroom-before-2.jpg';
import waianaeBathroomVanityAfter from '../assets/images/projects/waianae-bathroom-vanity-after.jpg';
import waianaeKitchenAfter1 from '../assets/images/projects/waianae-kitchen-after-1.jpg';
import waianaeKitchenAfter2 from '../assets/images/projects/waianae-kitchen-after-2.jpg';
import waianaeKitchenAfter3 from '../assets/images/projects/waianae-kitchen-after-3.jpg';
import waianaeKitchenBefore1 from '../assets/images/projects/waianae-kitchen-before-1.jpg';
import waianaeKitchenBefore2 from '../assets/images/projects/waianae-kitchen-before-2.jpg';
import waianaeRemodelDemo from '../assets/images/projects/waianae-remodel-demo.jpg';
import waianaeRemodelExteriorBefore1 from '../assets/images/projects/waianae-remodel-exterior-before-1.jpg';
import waianaeRemodelExteriorBefore2 from '../assets/images/projects/waianae-remodel-exterior-before-2.jpg';
import waianaeSecondUnitKitchenette1 from '../assets/images/projects/waianae-second-unit-kitchenette-1.jpg';
import waianaeSecondUnitKitchenette2 from '../assets/images/projects/waianae-second-unit-kitchenette-2.jpg';
import waianaeShowerAfter from '../assets/images/projects/waianae-shower-after.jpg';
// Edited copies (2026-11-27, honest edits only: crop, mild tone; SOURCES.md has the exact operations).
import hawaiiIslandNewHomeExterior2Edit from '../assets/images/projects/hawaii-island-new-home-exterior-2-edit.jpg';
import hawaiiIslandNewHomeExterior1Edit from '../assets/images/projects/hawaii-island-new-home-exterior-1-edit.jpg';
import hawaiiIslandNewHomeExterior4Edit from '../assets/images/projects/hawaii-island-new-home-exterior-4-edit.jpg';
import waianaeAdditionSidingDoneEdit from '../assets/images/projects/waianae-addition-siding-done-edit.jpg';
import longs2Edit from '../assets/images/projects/longs-drip-edge-2-edit.jpg';
import acsPergola2Edit from '../assets/images/projects/acs-hope-lodge-pergola-2-edit.jpg';
import waianaeAdditionFraming3Edit from '../assets/images/projects/waianae-addition-framing-3-edit.jpg';
import drivewayDuringEdit from '../assets/images/projects/driveway-salt-lake-during-edit.jpg';
import waianaeAdditionFraming1Edit from '../assets/images/projects/waianae-addition-framing-1-edit.jpg';
import waianaeAdditionFraming2Edit from '../assets/images/projects/waianae-addition-framing-2-edit.jpg';
import waianaeAdditionHouseWrapEdit from '../assets/images/projects/waianae-addition-house-wrap-edit.jpg';
import waianaeAdditionRoofEdit from '../assets/images/projects/waianae-addition-roof-edit.jpg';
import bambooAfterEdit from '../assets/images/projects/bamboo-floor-after-edit.jpg';


export type ImageSlot = {
  src: ImageMetadata | string;
  alt: string;
  placeholder: boolean;
  /** CSS object-position for crops, e.g. 'bottom'. */
  position?: string;
  /** Never crop on the server: the source is small and every pixel is needed (CSS crops instead). */
  keepAspect?: boolean;
  /** Intrinsic size for remote images (local ones carry their own). */
  width?: number;
  height?: number;
};

// Local, optimized by Astro's Image component.
export const logo = { src: ecmLogo, alt: 'Elite Construction Management logo' };
// Hero (2026-11-23): Ellard picked exterior-1, but it is only 1067px wide and looked soft when
// stretched to 1440 and 1920px wide (1.35x to 1.8x upscale). exterior-2 (2400px) stays sharp.
// 2026-11-27: the edited copy (tone only, same 2400x1800 framing).
const HERO_SRC = hawaiiIslandNewHomeExterior2Edit;
export const hero = { src: HERO_SRC, alt: 'New single family home built by Elite Construction Management on the Big Island', placeholder: false };

const job = (src: ImageMetadata, alt: string, position?: ImageSlot['position'], keepAspect?: boolean): ImageSlot => ({ src, alt, placeholder: false, position, keepAspect });

export const photos: Record<string, ImageSlot> = {
  // ECM job photos (SOURCES.md: "ECM job photos").
  // Only 709px wide: never upscaled or cropped on the server. Was the commercial page header for
  // one build (2026-11-25); back to acsSign until a full size building photo arrives.
  acsExterior:    job(acsExterior, 'American Cancer Society Clarence T.C. Ching Hope Lodge, Honolulu', 'sign', true),
  acsSign:        job(acsSign, 'American Cancer Society Hope Lodge sign on the building', 'upper'),
  acsCeiling1:    job(acsCeiling1, 'Open ceiling section during interior restoration and ceiling work at Hope Lodge', 'top'),
  acsCeiling2:    job(acsCeiling2, 'Finished ceiling panel after interior restoration and ceiling work at Hope Lodge', 'top'),
  pergolaView:    job(acsPergola2, 'Aluminum pergola frame at Hope Lodge with a view over Honolulu', 'upper'),
  // Hope Lodge cover and /commercial-tenant-improvements header (2026-11-27).
  pergolaEdit:    job(acsPergola2Edit, 'Aluminum pergola frame at the American Cancer Society Hope Lodge, looking toward Diamond Head'),
  // Commercial service image on the home page and service cards (2026-11-27).
  longsEdit:      job(longs2Edit, 'Longs Drugs store front with the new metal drip edge'),
  bambooBefore:   job(bambooBefore, 'Kaneohe residence before the bamboo floor remodel, bare concrete floor', 'lower'),
  bambooAfter:    job(bambooAfter, 'Kaneohe residence after the bamboo floor remodel', 'lower'),
  // /remodeling header (2026-11-27).
  bambooAfterEdit: job(bambooAfterEdit, 'Bamboo floor after the remodel at a Kaneohe residence'),
  bambooAfterAligned: job(bambooAfterAligned, 'Kaneohe residence after the bamboo floor remodel', 'lower'),
  walk1:          job(walk1, 'Garden courtyard with a concrete walkway', 'bottom'),
  walk2:          job(walk2, 'Forms and steel mesh set for a new concrete walkway in a garden courtyard, before the pour', 'lower'),
  drivewayBefore: job(drivewayBefore, 'Salt Lake residence before the concrete driveway, gravel lot', 'lower'),
  drivewayBeforeAligned: job(drivewayBeforeAligned, 'Salt Lake residence before the concrete driveway, gravel lot', 'center'),
  drivewayDuring: job(drivewayDuring, 'Crew placing and finishing a new concrete driveway and walkway at a Salt Lake home', 'center'),
  longsBefore:    job(longsBefore, 'Longs Drugs store roof edge before the metal drip edge replacement', 'upper'),
  longsAfter:     job(longsAfter, 'Longs Drugs store roof edge after the metal drip edge replacement', 'upper'),
  longs1:         job(longs1, 'Longs Drugs store roof edge during the metal drip edge replacement', 'upper'),
  longsStore:     job(longs2, 'Longs Drugs store front with the new metal drip edge', 'upper'),
  longsSign:      job(longs3, 'Longs Drugs sign below the roof edge during drip edge replacement', 'top'),

  // ECM job photos, Waianae and Mililani (keys are the file names).
  'mililani-bathroom-1': job(mililaniBathroom1, 'Remodeled bathroom in a Mililani home with a tiled shower, a vanity and a round mirror'),
  'mililani-bathroom-2': job(mililaniBathroom2, 'Remodeled bathroom in a Mililani home with a tiled tub and shower and a vanity'),
  'mililani-kitchen-1': job(mililaniKitchen1, 'Remodeled kitchen in a Mililani home with white cabinets and stainless steel appliances'),
  'mililani-kitchen-2': job(mililaniKitchen2, 'Remodeled kitchen in a Mililani home with white cabinets, a range and a dishwasher'),
  'mililani-remodel-dining-kitchen': job(mililaniRemodelDiningKitchen, 'Dining area and kitchen in a remodeled Mililani home'),
  'mililani-remodel-living-room': job(mililaniRemodelLivingRoom, 'Living room in a remodeled Mililani home'),
  'waianae-addition-framing-1': job(waianaeAdditionFraming1, 'Wall framing underway for a new addition beside a Waianae home'),
  'waianae-addition-framing-2': job(waianaeAdditionFraming2, 'Wall framing in progress on the new slab for a Waianae home addition'),
  'waianae-addition-framing-3': job(waianaeAdditionFraming3, 'Wall and roof framing going up for a new addition at a Waianae home'),
  'waianae-addition-house-wrap': job(waianaeAdditionHouseWrap, 'House wrap on the walls and siding ready to install at a Waianae home addition'),
  'waianae-addition-roof': job(waianaeAdditionRoof, 'Roof sheathing on and new siding up at a Waianae home addition, before roofing'),
  'waianae-addition-siding-done': job(waianaeAdditionSidingDone, 'New addition with a second unit at a Waianae home, during construction'),
  'waianae-bathroom-after-1': job(waianaeBathroomAfter1, 'Remodeled bathroom in a Waianae home with a tub, tiled walls and a vanity'),
  'waianae-bathroom-after-2': job(waianaeBathroomAfter2, 'Remodeled bathroom in a Waianae home with a tiled tub surround and a vanity'),
  'waianae-bathroom-before-1': job(waianaeBathroomBefore1, 'Original bathroom in a Waianae home before the remodel'),
  'waianae-bathroom-before-2': job(waianaeBathroomBefore2, 'Original bathroom with pink tile in a Waianae home before the remodel'),
  'waianae-bathroom-vanity-after': job(waianaeBathroomVanityAfter, 'Remodeled bathroom in a Waianae home with a vanity, a round mirror and a tiled shower'),
  'waianae-kitchen-after-1': job(waianaeKitchenAfter1, 'Remodeled kitchen in a Waianae home with white cabinets and stainless steel appliances'),
  'waianae-kitchen-after-2': job(waianaeKitchenAfter2, 'Remodeled kitchen in a Waianae home with white cabinets, a range and a range hood'),
  'waianae-kitchen-after-3': job(waianaeKitchenAfter3, 'Remodeled kitchen in a Waianae home with white cabinets and a small dining table'),
  'waianae-kitchen-before-1': job(waianaeKitchenBefore1, 'Original kitchen in a Waianae home before the remodel'),
  'waianae-kitchen-before-2': job(waianaeKitchenBefore2, 'Another view of the original kitchen in a Waianae home before the remodel'),
  'waianae-remodel-demo': job(waianaeRemodelDemo, 'Demolition underway at a Waianae home, with debris in the yard'),
  'waianae-remodel-exterior-before-1': job(waianaeRemodelExteriorBefore1, 'Waianae home before the remodel, with weathered wood siding'),
  'waianae-remodel-exterior-before-2': job(waianaeRemodelExteriorBefore2, 'Side of the Waianae home before the remodel, with weathered wood siding'),
  'waianae-second-unit-kitchenette-1': job(waianaeSecondUnitKitchenette1, 'Kitchenette in the second unit of a Waianae home, with white cabinets and a window'),
  'waianae-second-unit-kitchenette-2': job(waianaeSecondUnitKitchenette2, 'Kitchenette in the second unit of a Waianae home, with a small dining table'),
  'waianae-shower-after': job(waianaeShowerAfter, 'Tiled shower in a remodeled Waianae bathroom'),

  // Service slots now filled with ECM job photos (2026-11-23).
  kitchen:  job(mililaniKitchen1, 'Remodeled kitchen in a Mililani home with white cabinets and stainless steel appliances'),
  bathroom: job(waianaeBathroomAfter1, 'Remodeled bathroom in a Waianae home with a tub, tiled walls and a vanity'),
  // 2026-11-27: edited copy (car, person and bare gravel cropped out).
  adu:      job(waianaeAdditionSidingDoneEdit, 'New addition with a second unit at a Waianae home, during construction'),
  home:     job(hawaiiIslandNewHomeGreatRoom1, 'Great room and kitchen in a new home on the Big Island'),

  // ECM job photos, set 2: Big Island new homes and a second Waianae remodel (keys are the file names).
  'hawaii-island-new-home-barn-door': job(hawaiiIslandNewHomeBarnDoor, 'Sliding barn door in a new home on the Big Island'),
  'hawaii-island-new-home-bathroom-1': job(hawaiiIslandNewHomeBathroom1, 'Bathroom in a new home on the Big Island with a tub, marble-look tile and a long vanity'),
  'hawaii-island-new-home-double-vanity': job(hawaiiIslandNewHomeDoubleVanity, 'Bathroom with a double vanity in a new home on the Big Island'),
  'hawaii-island-new-home-entry': job(hawaiiIslandNewHomeEntry, 'Entry porch of a new home on the Big Island'),
  'hawaii-island-new-home-exterior-1': job(hawaiiIslandNewHomeExterior1, 'New single family home built by Elite Construction Management on the Big Island'),
  'hawaii-island-new-home-exterior-2': job(hawaiiIslandNewHomeExterior2, 'New single family home on the Big Island'),
  'hawaii-island-new-home-exterior-3': job(hawaiiIslandNewHomeExterior3, 'Another new single family home on the Big Island'),
  'hawaii-island-new-home-exterior-4': job(hawaiiIslandNewHomeExterior4, 'Front of a new home on the Big Island with a covered porch and French doors'),
  'hawaii-island-new-home-great-room-1': job(hawaiiIslandNewHomeGreatRoom1, 'Great room and kitchen in a new home on the Big Island', 'lower'),
  'hawaii-island-new-home-great-room-2': job(hawaiiIslandNewHomeGreatRoom2, 'Great room with a wood accent wall in a new home on the Big Island'),
  'hawaii-island-new-home-kitchen-1': job(hawaiiIslandNewHomeKitchen1, 'Kitchen with an island and stainless steel appliances in a new home on the Big Island'),
  'hawaii-island-new-home-kitchen-2': job(hawaiiIslandNewHomeKitchen2, 'Kitchen with white cabinets and an island in a new home on the Big Island'),
  'hawaii-island-new-home-kitchen-3': job(hawaiiIslandNewHomeKitchen3, 'Kitchen with a stone island and white cabinets in a new home on the Big Island'),
  'hawaii-island-new-home-living-dining': job(hawaiiIslandNewHomeLivingDining, 'Living and dining area in a new home on the Big Island'),
  'hawaii-island-new-home-shower': job(hawaiiIslandNewHomeShower, 'Tiled shower and tub in a new home on the Big Island'),
  'waianae-remodel-2-kitchen': job(waianaeRemodel2Kitchen, 'Remodeled kitchen with white cabinets in a Waianae home'),
  'waianae-remodel-2-shower': job(waianaeRemodel2Shower, 'Remodeled bathroom with a dark tiled shower in a Waianae home'),
};

// concrete-walkway-3 is not used anywhere: two crew faces are clearly readable (SOURCES.md).
// Edited copies for the home page (2026-11-27). The originals stay under their own keys for the portfolio.
photos['hawaii-island-new-home-exterior-1-edit'] = job(hawaiiIslandNewHomeExterior1Edit, 'Front of a new single family home on the Big Island with a garage and covered porch');
photos['hawaii-island-new-home-exterior-4-edit'] = job(hawaiiIslandNewHomeExterior4Edit, 'Front of a new home on the Big Island with a covered porch and French doors');
photos['waianae-addition-framing-3-edit'] = job(waianaeAdditionFraming3Edit, photos['waianae-addition-framing-3'].alt);
photos['drivewayDuring-edit'] = job(drivewayDuringEdit, photos.drivewayDuring.alt);
photos['waianae-addition-framing-1-edit'] = job(waianaeAdditionFraming1Edit, photos['waianae-addition-framing-1'].alt);
photos['waianae-addition-framing-2-edit'] = job(waianaeAdditionFraming2Edit, photos['waianae-addition-framing-2'].alt);
photos['waianae-addition-house-wrap-edit'] = job(waianaeAdditionHouseWrapEdit, photos['waianae-addition-house-wrap'].alt);
photos['waianae-addition-roof-edit'] = job(waianaeAdditionRoofEdit, photos['waianae-addition-roof'].alt);

// "From the job site" (2026-11-25 order, 2026-11-27 edited copies). walk2 and the demolition
// photo are unedited: the wheelbarrows sit inside the walkway forms and the utility pole stands
// mid frame, so a crop cannot remove them.
export const sliderKeys = [
  'waianae-addition-framing-3-edit', 'drivewayDuring-edit', 'waianae-addition-framing-1-edit', 'waianae-addition-framing-2-edit', 'walk2',
  'waianae-addition-house-wrap-edit', 'waianae-addition-roof-edit', 'waianae-remodel-demo',
];
