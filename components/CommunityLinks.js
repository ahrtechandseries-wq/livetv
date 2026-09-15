export default function CommunityLinks() {

  return (
    <section className="mx-4 mb-10 flex flex-col gap-3 rounded-xl border border-nex-border bg-nex-panel p-5 sm:flex-row">
      <a
        href="https://t.me/rnexflix"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 rounded-lg bg-nex-red px-4 py-3 text-center text-sm font-bold text-white
          transition-colors hover:bg-nex-red2 focus-visible:outline focus-visible:outline-2
          focus-visible:outline-white"
      >
        Join NexLive Community
      </a>

      <a
        href="https://t.me/ahr2215"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 rounded-lg border border-nex-border px-4 py-3 text-center text-sm font-bold text-nex-text
          transition-colors hover:bg-nex-panel2 focus-visible:outline focus-visible:outline-2
          focus-visible:outline-nex-red"
      >
        Contact AHR
      </a>
    </section>
  );

}
