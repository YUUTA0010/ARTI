export default function Loading() {
  return (
    <section className="site-container animate-pulse py-14" aria-label="Loading page">
      <div className="h-3 w-36 bg-line" />
      <div className="mt-5 h-12 w-2/3 bg-line sm:h-16" />
      <div className="mt-4 h-4 w-1/2 bg-line" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => <div key={item}><div className="aspect-square bg-line" /><div className="mt-4 h-4 w-2/3 bg-line" /><div className="mt-2 h-3 w-1/3 bg-line" /></div>)}
      </div>
    </section>
  );
}
