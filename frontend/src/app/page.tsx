import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import WorkSpace from "@/components/WorkSpace";

export default function Home() {
  return (
    <main className="flex bg-primary-50  ">
      <Sidebar />
      <WorkSpace />
    </main>
  );
}
