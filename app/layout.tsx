import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Issue Tracker",
  description: "A minimal kanban board",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="navbar-grid-icon" aria-hidden>
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
          <div className="navbar-breadcrumb">
            <span>My Project</span>
            <span className="sep">›</span>
            <span className="current">Issues</span>
          </div>
          <div className="navbar-avatar">N</div>
        </nav>
        {children}
      </body>
    </html>
  );
}
