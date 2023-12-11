import { Button } from '@chakra-ui/react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="flex flex-col h-full pt-[10vh] align-center items-center">
      <span className="text-7xl font-bold text-primary-alt w-[750px] text-center">
        Faz parte da equipe da <span className="text-primary">FACOM?</span>
      </span>
      <span className="text-gray-500 text-xl pt-8 w-[550px] text-center">
        Você pode participar da divisão de custos para manutenção da cafeteira e consumir itens na
        copa, como bolachas, manteiga, café, etc.
      </span>
      <span className="pt-8">
        <Button
          as={Link}
          href="/login"
          color="primary-alt"
          bgColor="primary"
          size="lg"
          _hover={{ color: 'primary', bgColor: 'primary-alt' }}
          rightIcon={<FaArrowRight />}
        >
          Entrar
        </Button>
      </span>
    </div>
  );
}
