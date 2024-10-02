import { Route, Routes } from "react-router-dom";
import Sidebar from "@/components/Sidebar.jsx";
import { lazy, Suspense } from "react";
import Spinner from "@/components/Spinner";
import { Toaster } from "@/components/ui/sonner"

const Root = lazy(() => import("@/pages/Root"));
const Add = lazy(() => import("@/pages/Add"));

export default function Main() {
  return (
    <div className="flex w-[680px] h-[500px] py-1">
      <div className="basis-[44px] border-r border-r-border">
        <Sidebar />
      </div>
      <div className="flex-1 px-1 overflow-y-scroll">
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/add" element={<Add />} />
          </Routes>
        </Suspense>
      </div>
      <Toaster position="bottom-center" closeButton richColors />
    </div>
  );
}
