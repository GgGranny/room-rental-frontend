// New: single source of truth for the "Find Rooms Near You" search radius.
// Do not hard-code radius values elsewhere — import from here so the default
// and the selectable options stay consistent across the whole feature.
export const RADIUS_OPTIONS_KM = [1, 3, 5, 10, 20] as const;

export type RadiusKm = (typeof RADIUS_OPTIONS_KM)[number];

export const DEFAULT_RADIUS_KM: RadiusKm = 5;
