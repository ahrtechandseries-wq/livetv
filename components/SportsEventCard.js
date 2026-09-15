export default function SportsEventCard({ event }) {

  const isLive = /live|in progress|1st half|2nd half/i.test(event.status || '');

  const isFinished = /finished|ft|final/i.test(event.status || '');

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-nex-border bg-nex-panel p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-nex-muted">
          {event.league}
        </span>

        <span
          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
            isLive
              ? 'bg-nex-red text-white'
              : isFinished
                ? 'bg-nex-panel2 text-nex-muted'
                : 'bg-nex-panel2 text-nex-text'
          }`}
        >
          {isLive ? '● Live' : event.status || 'Scheduled'}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="flex-1 truncate text-sm font-semibold text-nex-text">
          {event.homeTeam}
        </span>

        <span className="shrink-0 text-lg font-extrabold text-nex-text">
          {event.homeScore ?? '-'} : {event.awayScore ?? '-'}
        </span>

        <span className="flex-1 truncate text-right text-sm font-semibold text-nex-text">
          {event.awayTeam}
        </span>
      </div>

      <div className="flex justify-between text-xs text-nex-muted">
        <span>{event.date} {event.time}</span>
        {event.venue ? <span className="truncate">{event.venue}</span> : null}
      </div>
    </div>
  );

}
