# Design QA — Donor Language, Compact Mission Band, and Elul Focus

- Source visual truth: `/var/folders/cl/6zqls8cn5792yt8g6_crrsz40000gn/T/TemporaryItems/NSIRD_screencaptureui_bEoVzJ/צילום מסך 2026-07-27 ב-15.00.21.png`
- Pre-change full-page evidence: `/Users/mymac/Documents/דף נחיתה כללי תרומות/audit-before.jpg`
- Pre-change Elul evidence: `/Users/mymac/Documents/דף נחיתה כללי תרומות/audit-featured-before.jpg`
- Updated hero evidence: `/Users/mymac/Documents/דף נחיתה כללי תרומות/audit-after-top.jpg`
- Updated mission-band evidence: `/Users/mymac/Documents/דף נחיתה כללי תרומות/audit-after-rabbis.jpg`
- Updated Elul evidence: `/Users/mymac/Documents/דף נחיתה כללי תרומות/audit-after-featured.jpg`
- Updated donation-composer evidence: `/Users/mymac/Documents/דף נחיתה כללי תרומות/audit-after-composer.jpg`
- Combined source/implementation comparison: `/Users/mymac/Documents/דף נחיתה כללי תרומות/qa-current-rabbis-comparison.jpg`
- Hat-crop correction and updated impact evidence: `/Users/mymac/Documents/דף נחיתה כללי תרומות/qa-rabbis-impact-fixed.jpg`
- Post-fix source/implementation comparison: `/Users/mymac/Documents/דף נחיתה כללי תרומות/qa-rabbis-hat-fixed-comparison.jpg`
- Route and state: `/v4?lang=en`, hero, mission band, featured Elul appeal, and donation composer
- Desktop viewport: 1280 × 720 CSS px, device scale factor 1
- Source pixels: 1260 × 440
- Focused implementation region: normalized to 1260 × 352
- Density normalization: source and focused implementation were placed in one 1260 px-wide comparison image

## Full-view comparison

The mission band follows the supplied reference structure: two rabbis together on the left and three mission pillars on the right, all within one warm paper field. The revised band is 64 px shorter at its CSS minimum height, inset from the page edges, and pulled 30 px upward over the hero boundary. This gives the portraits a deliberate relationship to the hero while keeping the Elul appeal closer to the initial viewport.

The Elul section now starts as a distinct paper-framed feature with rounded image and story panels. Its donation composer uses a restrained gold edge and soft elevation instead of the earlier animated multicolor outline, so the amount selection and primary continuation action read as the central donation step.

## Focused-region comparison

The combined comparison was inspected for section height, five-column balance, portrait scale and grouping, vertical separators, icon scale, paper texture, corner treatment, and content density. The implementation intentionally compresses the source vertically while preserving its visual hierarchy, matching the user's request for less page height.

The updated composer screenshot was separately inspected for CTA hierarchy, amount-selection clarity, chosen-cause labeling, security reassurance, and transition into the broader ways-to-help section.

## Fidelity surfaces

- Fonts and typography: Cormorant Garamond remains the display face for names and major appeals; small uppercase labels now use donor-facing language with consistent tracking and hierarchy.
- Spacing and layout rhythm: the mission band is inset, shorter, and overlaps the hero edge; portraits are enlarged to 120% and moved inward by 8%; pillar cards are reduced from 278 px to 230 px minimum height.
- Colors and visual tokens: warm paper, midnight, burgundy, and gold remain consistent. The donation composer now uses a gold keyline and restrained shadow rather than an unrelated rainbow treatment.
- Image quality and assets: the supplied transparent rabbi portraits remain sharp and use a soft drop shadow. Both portraits were lowered and reduced slightly from 120% to 116% so Rabbi Yoram's hat remains fully visible without returning to the earlier undersized composition.
- Copy and content: visible uses of “campaign” were replaced with “cause,” “ways to help,” “support,” or a specific Elul/Kaparot action. The impact strip now uses the donor-provided annual figures: 136 countries, 6.5M Torah publications, 14,500 families supported through Chesed, and 76,000 people guided and strengthened. English and Spanish were updated together.
- Motion and timing: the hero overlay continues to fade in at 4.5 seconds while the video keeps playing.

## Comparison history

1. P1 — “campaign” appeared repeatedly in navigation, the Elul feature, donation selection, cards, trust copy, and modal copy, making the page feel like an internal fundraising system.
2. Fix — rewrote visible donor language around causes, gifts, support, and ways to help in English and Spanish.
3. P2 — “One permanent link. Every way to help.” prioritized a technical implementation detail that offers little donor value.
4. Fix — replaced it with “Every gift has a purpose. Choose where yours can help.” and explanatory copy focused on choosing a meaningful cause.
5. P2 — the mission band consumed too much vertical space and sat as a separate block below the hero; the portraits still felt small within it.
6. Fix — reduced the band and pillar heights, inset the paper field, pulled it over the hero boundary, enlarged the portraits, moved them inward, and strengthened their grounding shadow.
7. P2 — the Elul/Kaparot donation area lacked a strong visual boundary, and the animated multicolor composer edge did not match the brand.
8. Fix — added a clear paper frame around the Elul feature, rounded its main panels, and rebuilt the composer edge and elevation in the existing gold/burgundy visual language.
9. Post-fix evidence — `audit-after-rabbis.jpg`, `audit-after-featured.jpg`, and `audit-after-composer.jpg` show the corrected hierarchy and separation.
10. Copy verification — English and Spanish DOM snapshots confirm the new donor-facing labels, CTAs, cause terminology, and localized accessibility labels.
11. P1 — enlarging the portraits caused Rabbi Yoram's hat to touch and visibly clip against the top of the mission band.
12. Fix — lowered both portraits by 12 px and reduced their scale from 120% to 116%, preserving their visual weight while restoring clear space above both hats.
13. Post-fix evidence — `qa-rabbis-hat-fixed-comparison.jpg` shows the complete hat silhouettes in the same combined source/implementation view.
14. Data correction — replaced the previous publishing-center metrics and unrelated source link with the four annual impact figures supplied by Hameir Laarets; verified the English and Spanish renderings in the browser.

## Verification

- Production build and lint passed.
- English and Spanish states were inspected in the in-app browser.
- The primary Kaparot continuation still routes to the Elul site with language, amount, frequency, and attribution parameters.
- The prior source link was removed because it does not substantiate the newly supplied annual figures.
- No donation amounts, fundraiser attribution, navigation targets, or language behavior were removed.

## Findings

No actionable P0, P1, or P2 differences remain for the requested direction.

## Follow-up polish

The reference portraits use a stronger misted lower-edge fade than the supplied cutouts. The current shadow and scale integrate them well enough for this pass; reproducing the exact fade is optional P3 asset polish.

final result: passed

---

# Design QA — Mobile Hero Motion, Atmosphere, and Persistent Donation Dock

- Source visual truth: `/Users/mymac/Documents/דף נחיתה כללי תרומות/audit-colel-chabad-2026-07-27/09-hameir-public-mobile.png`
- Initial no-copy state: `/Users/mymac/Documents/דף נחיתה כללי תרומות/qa-mobile-hero-before-copy.png`
- Revised mobile implementation: `/Users/mymac/Documents/דף נחיתה כללי תרומות/qa-mobile-hero-timed-reveal.png`
- Revised desktop implementation: `/Users/mymac/Documents/דף נחיתה כללי תרומות/qa-desktop-donation-dock.png`
- Route and state: `/v4?lang=en`, initial hero playback, completed hero reveal, and persistent donation dock
- Mobile viewport and pixels: 393 × 852 CSS px and 393 × 852 image px, density 1
- Desktop viewport and pixels: 1440 × 900 CSS px and 1440 × 900 image px, density 1
- Normalization: the source and revised mobile captures use the same viewport, pixel dimensions, route, language, and completed-copy state

## Full-view comparison

The revised mobile hero preserves the existing 16:9 globe film, typography, CTA hierarchy, and vertical composition. The previously flat midnight field now continues the visual language of the film with a low-contrast reuse of the real globe poster behind the copy. The treatment remains dark enough for the white and gold typography to retain strong contrast.

The desktop capture confirms that the donation dock now appears as a compact bottom-right control without obscuring the primary hero headline, navigation, or central scroll cue.

## Focused-region comparison

The hero and donation dock were large and legible in the full-view captures, so a separate crop was not required. The initial no-copy mobile state was inspected independently to confirm that the waiting period still looks intentional before the text begins.

## Fidelity surfaces

- Fonts and typography: the Cormorant Garamond display hierarchy, DM Sans body copy, weights, wrapping, and line spacing remain unchanged.
- Spacing and layout rhythm: the 16:9 film and copy positions are preserved. The desktop dock uses a compact 360 px maximum width and remains clear of the headline.
- Colors and visual tokens: midnight, burgundy, gold, and white remain consistent. The globe texture adds depth without introducing a new palette.
- Image quality and assets: the existing 4K hero video and its real poster asset are reused; no synthetic placeholder or drawn replacement was introduced.
- Copy and content: all English hero, campaign, amount, and CTA copy remains unchanged.
- Motion: mobile reveal now waits 1.65 real seconds after playback begins and then dissolves in line by line over a calmer stagger. Desktop retains the video-led reveal threshold.

## Comparison history

1. P2 — the mobile copy appeared immediately and the solid blue field beneath the film felt visually inactive.
2. Fix — tied mobile reveal to a real-time playback delay, added a slower blurred dissolve, and reused the globe poster as a subdued atmospheric background.
3. P2 — the persistent donation dock existed only below the 520 px breakpoint.
4. Fix — made the dock available on desktop as a compact bottom-right control and gave both variants a globe-derived surface.
5. Post-fix evidence — `qa-mobile-hero-before-copy.png`, `qa-mobile-hero-timed-reveal.png`, and `qa-desktop-donation-dock.png`.

## Verification

- Production build and lint passed.
- Mobile initial state, completed reveal, and desktop layout were inspected in the in-app browser.
- The desktop dock was clicked and scrolled to the donation composer.
- Browser logs contained no errors.

## Findings

No actionable P0, P1, or P2 issues remain for the requested change.

## Follow-up polish

The exact perceived pace still depends slightly on device video startup time; the real-time delay prevents the media timeline from making the mobile copy arrive prematurely.

final result: passed
