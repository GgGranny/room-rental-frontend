// Canonical room-type categories, mirroring the backend RoomType enum.
//
// Values are the EXACT enum names because the backend search matches the
// free-text `roomType` column with a case-sensitive equals (RoomSpecifications).
// The create/edit forms store these strings and the home filter queries by them,
// so keeping a single source of truth here prevents them from drifting apart
// (which is what silently broke the old "single"/"apartment" chips).
export const ROOM_TYPE_OPTIONS = [
    { value: "PRIVATE", label: "Private" },
    { value: "SHARED", label: "Shared" },
    { value: "APARTMENT", label: "Apartment" },
    { value: "HOUSE", label: "House" },
    { value: "HOSTEL", label: "Hostel" },
    { value: "GARAGE", label: "Garage" },
    { value: "COMMERCIAL", label: "Commercial" },
    { value: "OTHER", label: "Other" },
] as const;

export type RoomTypeValue = (typeof ROOM_TYPE_OPTIONS)[number]["value"];

// Categories surfaced as home-page filter chips: every room type EXCEPT
// OTHER and COMMERCIAL.
export const FILTERABLE_ROOM_TYPES = ROOM_TYPE_OPTIONS.filter(
    (option) => option.value !== "OTHER" && option.value !== "COMMERCIAL",
);
