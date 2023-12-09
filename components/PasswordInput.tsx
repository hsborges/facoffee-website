import { Button, Input, InputGroup, InputProps, InputRightElement } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export function PasswordInput(props: InputProps) {
  const [show, setShow] = useState(false);

  const Icon = useMemo(() => (show ? FaEyeSlash : FaEye), [show]);

  return (
    <InputGroup>
      <Input pr="3rem" type={show ? 'text' : 'password'} {...props} />
      <InputRightElement width="3rem">
        <Icon className="cursor-pointer opacity-50" onClick={() => setShow(!show)} />
      </InputRightElement>
    </InputGroup>
  );
}
