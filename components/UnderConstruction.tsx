import Image from 'next/image';

export default function UnderConstruction() {
  return (
    <div className="h-[75%] w-full flex flex-col justify-center items-center gap-2">
      <Image
        src={'/images/under_construction.png'}
        alt="Página em construção"
        width={225}
        height={0}
      />
      <span className="text-4xl font-bold text-primary">Página em construção</span>
    </div>
  );
}
