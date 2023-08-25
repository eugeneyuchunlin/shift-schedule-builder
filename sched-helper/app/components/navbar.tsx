'use client'

import { useContext } from 'react'
import Link from 'next/link'
import { Container, Nav, Navbar} from '@/app/components/bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import { type } from 'os';
import { UserContext } from '../dashboard/components/contexts/user_context';

interface NavItem {
  name: string,
  href: string,
};

interface NavBarProps {
  children?: React.ReactNode,
  items?: NavItem[],
  offcanvas?: React.ReactNode[],
  session?: any,
}

export default function NavBar(
  {children, 
    items, 
    offcanvas,
    session,
  }: NavBarProps
  )
{

  const { user }  = useContext(UserContext);

  console.log(session)
    return (
      <>
        <Navbar expand="lg" style={{ backgroundColor: 'white' }}>
          <Container fluid>
            {/* if login href = dashboard */}
            <Navbar.Brand href="/">Shift Builder(pre-α)</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                { 
                  items?.map((item, index) => {
                    return (
                        <Nav.Link href={item.href} key={index}>{item.name}</Nav.Link>
                    );
                  })
                }
                {offcanvas}
                {session || user ? <Nav.Link href="/api/auth/signout">Sign out</Nav.Link> : null}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {children}
      </>
      );
}