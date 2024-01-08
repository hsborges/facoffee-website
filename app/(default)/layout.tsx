import Navbar from '@/components/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col overflow-x-hidden h-full">
      <Navbar className="px-[5vw]" />
      <section className="mx-[5vw] mt-4 grow">{children}</section>
    </main>
  );
}
