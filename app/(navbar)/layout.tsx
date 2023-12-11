import Navbar from '@/components/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col w-full h-screen">
      <Navbar className="px-[5%]" />
      <section className="grow px-[5%] pt-4">{children}</section>
    </main>
  );
}
