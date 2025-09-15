import Link from "next/link";

export default function Home() {
  return (
    <div className="grid md:grid-cols-2 gap-6 items-center">
      <div className="card">
        <h1 className="text-3xl font-bold mb-2">Snap the Emoji Pose</h1>
        <p className="mb-4">
          Match your face to the target emoji (smile 🙂, mouth open 😮, wink
          😜). We analyze your webcam or uploaded photo.
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Works on desktop & mobile (HTTPS)</li>
          <li>Local history with snapshots</li>
          <li>Random face emojis via node-emoji (server)</li>
        </ul>
        <div className="flex gap-2">
          <Link href="/play" className="btn btn-primary">
            Play Now
          </Link>
          <Link href="/history" className="btn">
            View History
          </Link>
        </div>
      </div>
      <div className="card">
        <img src="/logo.svg" alt="logo" className="w-40 h-40 mx-auto" />
        <div className="text-center mt-4">
          <span className="badge">AI</span>{" "}
          <span className="badge">Human Detection</span>{" "}
          <span className="badge">AR-Ready</span>
        </div>
      </div>
    </div>
  );
}
