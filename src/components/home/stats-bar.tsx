import { Users, Sparkles, MapPin, Award } from "lucide-react";

export function HomeStatsBar() {
  const stats = [
    {
      label: "Verified Artists & Studios",
      value: "500+",
      desc: "Vetted for technical mastery & hygiene",
      icon: Users,
    },
    {
      label: "Celebrations Styled",
      value: "15,000+",
      desc: "Bridal, reception & editorial events",
      icon: Sparkles,
    },
    {
      label: "Wedding Destinations",
      value: "25+",
      desc: "Metros & luxury destination hubs",
      icon: MapPin,
    },
    {
      label: "Average Bride Rating",
      value: "4.95 / 5",
      desc: "Based on 3,400+ verified client reviews",
      icon: Award,
    },
  ];

  return (
    <section className="bg-neutral-950 border-b border-neutral-900 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`flex flex-col items-center sm:items-start text-center sm:text-left ${
                  idx !== 0 ? "lg:border-l lg:border-neutral-800/80 lg:pl-8" : ""
                }`}
              >
                <div className="flex items-center gap-2 mb-2 text-amber-400">
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    {stat.label}
                  </span>
                </div>
                <div className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {stat.value}
                </div>
                <p className="text-xs text-neutral-400 mt-1 max-w-[200px]">
                  {stat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
