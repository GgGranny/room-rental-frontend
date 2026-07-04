import { DollarSign, LayoutGrid, Star, User } from "lucide-react";


type FilterIconsType = {
    id: number;
    name: string;
    href: string;
    icon?: React.ReactNode;
}
const style = {
    width: 15,
    height: 15
}

export const filterIcons: FilterIconsType[] = [
    {
        id: 0,
        name: "luxury",
        href: "#",
        icon: <Star style={style} />
    },
    {
        id: 1,
        name: "single",
        href: "#",
        icon: <User style={style} />
    },
    {
        id: 2,
        name: "budget",
        href: "#",
        icon: <DollarSign style={style} />
    },
    {
        id: 3,
        name: "apartment",
        href: "#",
        icon: <LayoutGrid style={style} />
    }
]