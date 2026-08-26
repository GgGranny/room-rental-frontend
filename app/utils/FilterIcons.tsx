import { BedDouble, Building2, DollarSign, Home, Lock, Star, Users, Warehouse } from "lucide-react";
import { FILTERABLE_ROOM_TYPES } from "@/app/lib/roomTypes";


type FilterIconsType = {
    id: number;
    name: string;   // stable lowercase key used by the home page + categoryFilters
    label: string;  // human-readable chip text
    href: string;
    icon?: React.ReactNode;
}
const style = {
    width: 15,
    height: 15
}

// One icon per room-type category value (see app/lib/roomTypes).
const roomTypeIcon: Record<string, React.ReactNode> = {
    PRIVATE: <Lock style={style} />,
    SHARED: <Users style={style} />,
    APARTMENT: <Building2 style={style} />,
    HOUSE: <Home style={style} />,
    HOSTEL: <BedDouble style={style} />,
    GARAGE: <Warehouse style={style} />,
};

// Home-page quick filters: every room type except OTHER/COMMERCIAL (derived from
// the shared roomTypes source of truth), followed by the price-range shortcuts.
export const filterIcons: FilterIconsType[] = [
    ...FILTERABLE_ROOM_TYPES.map((option, index) => ({
        id: index,
        name: option.value.toLowerCase(),
        label: option.label,
        href: "#",
        icon: roomTypeIcon[option.value],
    })),
    { id: 100, name: "budget", label: "Budget", href: "#", icon: <DollarSign style={style} /> },
    { id: 101, name: "luxury", label: "Luxury", href: "#", icon: <Star style={style} /> },
];
