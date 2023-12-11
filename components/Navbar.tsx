'use client';

import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import classNames from 'classnames';
import Link from 'next/link';
import { useMemo } from 'react';
import { MdAdminPanelSettings } from 'react-icons/md';
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
      className={classNames(
        'flex items-center justify-between py-2 bg-primary h-[64px]',
        props.className,
      )}
    >
      <Link href={'/'}>
        <Logo variant="white" size="lg" />
      </Link>
      {!context.loading && context.doesSessionExist ? (
        <div className="flex items-center gap-8">
          <Link href={'/admin'}>
            <span className="flex gap-1 text-white">
              <MdAdminPanelSettings className="text-2xl" /> Admin
            </span>
          </Link>
          <Menu>
            <MenuButton>
              <Avatar
                size={'md'}
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
        </div>
      ) : (
        <Button size={'sm'} color="primary-alt" as={Link} href={'/login'}>
          Entrar
        </Button>
      )}
    </nav>
  );
}
