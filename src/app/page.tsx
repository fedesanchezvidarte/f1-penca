export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-12">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-gray-100">F1 Penca</h1>

        <div className="flex gap-4 flex-col sm:flex-row">
          <a href="/login" className="btn-primary">
            Get Started
          </a>
          <a href="/about" className="btn-secondary">
            Learn More
          </a>
        </div>
      </main>
    </div>
  );
}
