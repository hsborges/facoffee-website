'use client';

import { Avatar, Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import classNames from 'classnames';
import Link from 'next/link';
import { useMemo } from 'react';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';

import Logo from './Logo';

export default function Navbar(props: { className?: string }) {
  const context = useSessionContext();

  const fullName = useMemo(() => {
    return context.loading
      ? '...'
      : `${context.accessTokenPayload.first_name} ${context.accessTokenPayload.last_name}`;
  }, [context]);

  return (
    <nav
      className={classNames('flex items-center justify-between py-4 bg-primary', props.className)}
    >
      <Link href={'/'}>
        <Logo variant="white" size="lg" />
      </Link>
      {!context.loading && context.doesSessionExist ? (
        <Menu>
          <MenuButton>
            <Avatar
              size={'sm'}
              name={fullName}
              bgColor="primary-alt"
              color="white"
              fontWeight={'bold'}
            />
          </MenuButton>
          <MenuList minWidth="150px">
            <MenuItem as={Link} href="/logout">
              Sair
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Button size={'sm'} color="primary-alt" as={Link} href={'/login'}>
          Entrar
        </Button>
      )}
    </nav>
  );
}
