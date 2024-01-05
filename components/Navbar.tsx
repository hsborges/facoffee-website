'use client';

import { Avatar, Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import classNames from 'classnames';
import Link from 'next/link';
import { useMemo } from 'react';
import { MdAdminPanelSettings } from 'react-icons/md';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';

import Logo from './Logo';

export default function Navbar(props: { className?: string }) {
  const context = useSessionContext();

  const userName = useMemo(() => {
    return (
      (!context.loading &&
        context.doesSessionExist &&
        `${context.accessTokenPayload.first_name} ${context.accessTokenPayload.last_name}`) ||
      undefined
    );
  }, [context]);

  return (
    <nav
      className={classNames(
        'flex items-center justify-between py-2 bg-primary h-[64px]',
        props.className,
      )}
    >
      <Link href={context.loading || !context.doesSessionExist ? '/' : '/me'}>
        <Logo variant="white" size="lg" />
      </Link>
      {!context.loading && context.doesSessionExist ? (
        <div className="flex items-center gap-8">
          {context.accessTokenPayload?.roles?.includes('admin') && (
            <Link href={'/admin'}>
              <span data-testid="admin-btn" className="flex gap-1 text-white">
                <MdAdminPanelSettings className="text-2xl" /> Admin
              </span>
            </Link>
          )}
          <Menu>
            <MenuButton data-testid="menu-btn">
              <Avatar
                size={'md'}
                name={userName}
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
        <Button data-testid="login-btn" size={'sm'} color="primary-alt" as={Link} href={'/login'}>
          Entrar
        </Button>
      )}
    </nav>
  );
}
