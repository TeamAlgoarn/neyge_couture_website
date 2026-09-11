import type { ReactNode } from "react";
import "../styles/admin-auth.css";

type AdminAuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function AdminAuthLayout({ title, subtitle, children }: AdminAuthLayoutProps) {
  return (
    <div className="admin-auth-background">
      <section className="admin-auth-card" aria-labelledby="admin-auth-title">
        <div className="admin-auth-ornament" aria-hidden="true"><div /></div>
        <h1 id="admin-auth-title">{title}</h1>
        <p className="admin-auth-subtitle">{subtitle}</p>
        <div className="admin-auth-divider" aria-hidden="true"><span /><i /><span /></div>
        {children}
      </section>
    </div>
  );
}
