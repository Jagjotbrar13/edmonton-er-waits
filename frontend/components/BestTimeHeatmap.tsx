import { Fragment } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = [0, 4, 8, 12, 16, 20];

export function BestTimeHeatmap() {
  return (
    <div className="border border-zinc-200 bg-white p-4">
      <h2 className="mb-4 font-semibold">Best Time To Go</h2>
      <div className="grid grid-cols-[64px_repeat(6,1fr)] gap-2 text-sm">
        <span />
        {hours.map((hour) => (
          <span key={hour} className="text-zinc-500">{hour}:00</span>
        ))}
        {days.map((day) => (
          <Fragment key={day}>
            <span className="text-zinc-500">{day}</span>
            {hours.map((hour) => (
              <span key={`${day}-${hour}`} className="h-8 bg-zinc-100" />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
