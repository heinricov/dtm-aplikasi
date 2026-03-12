export default function page() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
          <span className="text-lg font-semibold">!</span>
        </div>
        <h1 className="text-xl font-semibold">Akses Ditolak</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Anda tidak memiliki akses ke halaman ini. Hubungi admin jika Anda
          membutuhkan izin.
        </p>
        <div className="mt-6">
          <a
            href="/dashboard"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            Kembali ke Dashboard
          </a>
        </div>
      </div>
    </section>
  );
}
