'use client'
import Link from 'next/link'
import { Container, Nav, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'



export default function NavBar({children, items}:{children: React.ReactNode, items?: React.ReactNode[]}){
    // let navItems: React.ReactNode[] = [] 
    // if(items){
    //   navItems = items.map((item, index) => {
    //       return (
    //           <Nav.Link key={index}>
    //               {item}
    //           </Nav.Link>
    //       )
    //   })
    // }
    

    return (
      <>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container fluid>
            {/* if login href = dashboard */}
            <Navbar.Brand href="/">Shift Builder</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                {items}
                {/* <Nav.Link href="/docs">Docs</Nav.Link> */}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {children}
      </>
      );
}