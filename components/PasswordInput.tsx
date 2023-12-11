import { Input, InputGroup, InputProps, InputRightElement, useBoolean } from '@chakra-ui/react';
import { forwardRef, useMemo } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const PasswordInput = forwardRef(function PasswordInput(props: InputProps, ref) {
  const [show, setShow] = useBoolean(false);

  const Icon = useMemo(() => (show ? FaEyeSlash : FaEye), [show]);

  return (
    <InputGroup>
      <Input pr="3rem" type={show ? 'text' : 'password'} ref={ref} {...props} />
      <InputRightElement width="3rem">
        <Icon className="cursor-pointer opacity-50" onClick={setShow.toggle} />
      </InputRightElement>
    </InputGroup>
  );
});
