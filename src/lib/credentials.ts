// Credential lines for the trust strip and the About page. "Hawaiian owned" (a draft answer for
// Jesse, confirm:false) goes right after "Veteran owned" while it is shown (src/lib/draft.ts).
// Only import in page or component frontmatter.
import { business, credentials, hawaiianOwned, slots } from '../content/site';
import { shown, type Confirmable } from './draft';

export type CredentialItem = { text: string; draft?: Confirmable };

export function credentialItems(): CredentialItem[] {
  const items: CredentialItem[] = [];
  for (const text of credentials) {
    items.push({ text });
    if (text === business.veteranOwned && shown(hawaiianOwned)) items.push({ text: hawaiianOwned.text, draft: hawaiianOwned });
  }
  if (slots.insurance.enabled && slots.insurance.text) items.push({ text: slots.insurance.text });
  return items;
}
