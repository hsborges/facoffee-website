'use client';

import { inscrever, useAssinatura } from '@/apis/assinatura';
import { Plano, usePlanos } from '@/apis/planos';
import { currency } from '@/utils/formatter';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Select,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  useToast,
} from '@chakra-ui/react';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaArrowRight, FaCheck } from 'react-icons/fa';

const steps = [
  { title: 'Plano', description: 'Selecione o plano' },
  { title: 'Tempo', description: 'Selecione o período' },
  { title: 'Confirmação', description: 'Confirme os dados' },
];

export default function Assinar() {
  const { activeStep, goToNext, setActiveStep } = useSteps({ index: 0, count: 3 });

  const router = useRouter();
  const toast = useToast();

  const { isLoading, data: planos } = usePlanos(true);

  const [plano, setPlano] = useState<Plano>();
  const [periodo, setPeriodo] = useState<number>();
  const [submiting, setSubmiting] = useState(false);

  return (
    <div className="h-full flex flex-col items-center">
      <Stepper index={activeStep} colorScheme="primary" className="h-16 w-1/2 mt-8 mb-16">
        {steps.map((step, index) => (
          <Step key={index} onClick={() => activeStep > index && setActiveStep(index)}>
            <StepIndicator className="cursor-pointer">
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <div>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </div>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      <div className="grow flex items-center mt-[-10%]">
        <div className={classNames('flex gap-4', { hidden: activeStep !== 0 })}>
          {(planos || []).map((plano, index) => (
            <Card key={index} maxW="xs" align="center" className="!bg-primary">
              <CardHeader>
                <span className="text-xl font-bold">{plano.nome}</span>
              </CardHeader>
              <CardBody className="flex">
                <span className="text-center">{plano.descricao}</span>
              </CardBody>
              <CardBody className="flex items-center">
                <span className="text-2xl text-primary-alt font-bold">{currency(plano.valor)}</span>
              </CardBody>
              <CardFooter>
                <Button
                  colorScheme="gray"
                  onClick={() => {
                    setPlano(plano);
                    goToNext();
                  }}
                >
                  Selecionar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className={classNames('flex justify-center gap-4', { hidden: activeStep !== 1 })}>
          <div className="flex flex-col gap-8 items-center">
            <div className="text-xl">Selecione o período que deseja assinar:</div>
            <div>
              <Select
                onChange={(e) => setPeriodo(e.target.value ? parseInt(e.target.value) : undefined)}
              >
                <option value="">Até eu cancelar</option>
                {Array.from({ length: 12 }).map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1} meses
                  </option>
                ))}
              </Select>
            </div>
            <small className="text-gray-500">
              Nota: você poderá cancelar a assinatura a qualquer momento
            </small>
            <div className="text-center">
              <Button colorScheme="primary" onClick={() => goToNext()} rightIcon={<FaArrowRight />}>
                Próximo
              </Button>
            </div>
          </div>
          <Divider orientation="vertical" colorScheme="primary" />
          <div className="flex"></div>
        </div>
        <div className={classNames('text-center text-xl', { hidden: activeStep !== 2 })}>
          <div>
            Você selecionou o plano{' '}
            <span className="text-primary-alt font-bold underline">{plano?.nome}</span> com
            renovação automática por{' '}
            <span className="text-primary-alt font-bold underline">
              {periodo ? `${periodo} meses` : 'tempo indeterminado'}
            </span>
            .
          </div>
          <div className="mt-8">
            <Button
              colorScheme="primary"
              size="lg"
              rightIcon={<FaCheck />}
              onClick={() =>
                Promise.resolve(setSubmiting(true))
                  .then(() => inscrever(plano as Plano, periodo))
                  .then(() => {
                    toast({
                      status: 'success',
                      title: 'Assinatura realizada com sucesso!',
                      colorScheme: 'primary',
                    });
                    router.push('/me');
                  })
                  .catch((err) =>
                    toast({
                      status: 'error',
                      title: 'Erro ao realizar assinatura!',
                      description: err.message,
                    }),
                  )
                  .finally(() => setSubmiting(false))
              }
            >
              Confirmar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
