import { Bed, Building2, Heart, Layers, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { RoomListItem } from "@/app/services/roomService";

const statusStyles: Record<string, { dot: string; text: string; bg: string }> = {
    AVAILABLE: { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
    BOOKED: { dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
    MAINTENANCE: { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
    UNAVAILABLE: { dot: "bg-slate-400", text: "text-slate-600", bg: "bg-slate-100" },
};

function formatNpr(price: number) {
    return `Rs ${new Intl.NumberFormat("en-IN").format(price)}`;
}

export default function Card({
    rooms,
    favorites,
    toggleFavorite,
}: {
    rooms: RoomListItem[];
    favorites: string[];
    toggleFavorite: (id: string) => void;
}) {
    return (
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {rooms.map((room) => {
                const isLiked = favorites.includes(room.roomId);
                const status = statusStyles[room.status] ?? statusStyles.UNAVAILABLE;
                const image = room.imageUrls?.[0]?.url;
                const place = room.location || [room.city, room.district].filter(Boolean).join(", ") || "Nepal";
                return (
                    <Link
                        href={`/room/${room.roomId}`}
                        key={room.roomId}
                        className="group dark:bg-slate-800 dark:border-slate-600 dark:hover:shadow-none bg-white rounded-2xl overflow-hidden border border-slate-200/50 hover:shadow-xl hover:shadow-slate-100/80 transition-all duration-300 flex flex-col justify-between hover:scale-[1.02]"
                    >
                        {/* Image & Badges Frame */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                            {image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={image}
                                    alt={room.roomTitle}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-500">
                                    <Building2 className="w-10 h-10" />
                                </div>
                            )}

                            {/* Status Indicator Badge */}
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                                <div className={`px-2.5 py-1 ${status.bg} rounded-full flex items-center gap-1.5 shadow-sm`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                                    <span className={`text-[10px] font-extrabold tracking-wider uppercase ${status.text}`}>{room.status}</span>
                                </div>
                                {room.featured && (
                                    <div className="px-2.5 py-1 bg-amber-500 text-white rounded-full flex items-center gap-1 shadow-sm">
                                        <Sparkles className="w-3 h-3 fill-current" />
                                        <span className="text-[10px] font-extrabold tracking-wider uppercase">Featured</span>
                                    </div>
                                )}
                            </div>

                            {/* Heart Action Button */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleFavorite(room.roomId);
                                }}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white transition-colors"
                            >
                                <Heart className={`w-4 h-4 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-slate-700"}`} />
                            </button>

                            {/* Price Display */}
                            <div className="absolute bottom-3 left-3 bg-indigo-600 text-white font-bold text-sm px-3 py-1.5 rounded-xl shadow-md shadow-indigo-950/20">
                                {formatNpr(room.price)} <span className="text-[10px] font-normal opacity-75">/ month</span>
                            </div>
                        </div>

                        {/* Card Meta Content Info */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-slate-800 tracking-normal truncate group-hover:text-indigo-600 transition-colors dark:text-slate-300 dark:group-hover:text-white mb-1.5">
                                    {room.roomTitle}
                                </h3>

                                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mb-4 dark:text-slate-300">
                                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate">{place}</span>
                                </div>
                            </div>

                            {/* Technical Configuration Specs */}
                            <div className="flex items-center gap-4 pt-1 border-t border-slate-100 text-[12px] font-medium text-slate-500 dark:text-slate-300 dark:border-t-slate-700">
                                {room.roomType && (
                                    <div className="flex items-center gap-1.5">
                                        <Bed className="w-3 h-3 text-slate-500 stroke-[1.8] dark:text-slate-400" />
                                        <span className="capitalize">{room.roomType}</span>
                                    </div>
                                )}
                                {room.floorNumber != null && (
                                    <div className="flex items-center gap-1.5">
                                        <Layers className="w-3 h-3 text-slate-500 stroke-[1.8] dark:text-slate-400" />
                                        <span>Floor {room.floorNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
