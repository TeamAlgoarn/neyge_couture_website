import type { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

type Props = {
  title: string;
  children: ReactNode;
};

export default function AdminLayout({ title, children }: Props) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />

      <div className="flex-1">
        <div className="border-b bg-white px-6 py-4">
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}