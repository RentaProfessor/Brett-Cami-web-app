"use client"

export function ArchiveSection() {
  return (
    <section id="archive" className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-6xl w-full text-center">
        <h2 className="font-serif text-4xl md:text-6xl text-pink-600 mb-8">Archive</h2>
        <p className="font-sans text-lg text-muted-foreground">
          Your complete letter archive is available in the Letters section above. Scroll up to browse all your love
          letters! 💕
        </p>
      </div>
    </section>
  )
}
