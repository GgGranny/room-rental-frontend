import { Heart, MapPin, Star } from "lucide-react";

export default function Card({ properties, favorites, toggleFavorite }: { properties: any[]; favorites: number[]; toggleFavorite: (id: number) => void }) {
    return (
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {properties.map((item) => {
                const isLiked = favorites.includes(item.id);
                return (
                    <div key={item.id} className="group dark:bg-slate-800 dark:border-slate-600 dark:hover:shadow-none bg-white rounded-2xl overflow-hidden border border-slate-200/50 hover:shadow-xl hover:shadow-slate-100/80 transition-all duration-300 flex flex-col justify-between hover:scale-[1.02]">

                        {/* Image & Badges Frame */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            {/* Status Indicator Badge */}
                            {item.badge && (
                                <div className={`absolute top-3 left-3 px-2.5 py-1 ${item.badgeBgColor} rounded-full flex items-center gap-1.5 shadow-sm`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${item.badgeColor}`}></span>
                                    <span className={`text-[10px] font-extrabold tracking-wider uppercase ${item.badgeTextColor}`}>{item.badge}</span>
                                </div>
                            )}

                            {/* Heart Action Button */}
                            <button
                                onClick={() => toggleFavorite(item.id)}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white transition-colors"
                            >
                                <Heart className={`w-4 h-4 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-slate-700"}`} />
                            </button>

                            {/* Price Display */}
                            <div className="absolute bottom-3 left-3 bg-indigo-600 text-white font-bold text-sm px-3 py-1.5 rounded-xl shadow-md shadow-indigo-950/20">
                                {item.price} <span className="text-[10px] font-normal opacity-75">/ month</span>
                            </div>
                        </div>

                        {/* Card Meta Content Info */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <h3 className="text-sm font-semibold text-slate-800 text-base tracking-normal truncate group-hover:text-indigo-600 transition-colors dark:text-slate-300 dark:group-hover:text-white">{item.title}</h3>
                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-700 whitespace-nowrap dark:text-slate-300">
                                        <Star className="w-3.5 h-3.5 fill-green-700 text-green-700" />
                                        <span>{item.rating}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mb-4 dark:text-slate-300">
                                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                                    <span>{item.location}</span>
                                </div>
                            </div>

                            {/* Technical Configuration Specs */}
                            <div className="flex items-center gap-4 pt-1 border-t border-slate-100 text-[12px] font-medium text-slate-500 dark:text-slate-300 dark:border-t-slate-700">
                                {item.details.map((detail, idx) => {
                                    const DetailIcon = detail.icon;
                                    return (
                                        <div key={idx} className="flex items-center gap-1.5">
                                            <DetailIcon className="w-3 h-3 text-slate-500 stroke-[1.8] dark:text-slate-400" />
                                            <span>{detail.text}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                );
            })}
        </div>
    )
}