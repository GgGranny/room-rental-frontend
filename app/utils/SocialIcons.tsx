import { IconType } from "react-icons";
import { LuFacebook, LuInstagram, LuTwitter, LuYoutube } from "react-icons/lu";

type SocialIconsType = {
    name: string;
    href: string;
    icon: IconType;
}

export const socialIcons: SocialIconsType[] = [
    { name: "Facebook", href: "#", icon: LuFacebook },
    { name: "Twitter", href: "#", icon: LuTwitter },
    { name: "Instagram", href: "#", icon: LuInstagram },
    { name: "Youtube", href: "#", icon: LuYoutube },
] 