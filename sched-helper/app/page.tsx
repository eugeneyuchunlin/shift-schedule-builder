import { Container, Row, Col, Nav} from '@/app/components/bootstrap';
import { AuthOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import UserAuthForm from './components/user-auth-form';
import NavBar from './components/navbar';
import Typewriter from './components/typewriter';

import { redirect } from 'next/navigation';

import 'bootstrap/dist/css/bootstrap.min.css'
import styles from './page.module.css';

export default async function Page(){
  const session = await getServerSession(AuthOptions);
  if(session){
    redirect('/dashboard');
  }

  return (
    <>
      <NavBar items={[
        {
          name: 'Features',
          href: '#features',
        },
        {
          name: 'Team',
          href: '#team',
        }
      ]}
      session={session} 
      >
      </NavBar>
      <Container className={styles.main_container} fluid>
        <Row>
          <Col sm={8}>
            <div className={styles.jumbotron}>
              <h1>Shift Builder</h1>
              <Typewriter className={styles.subtitle} text='Empower your shift planning for employees' delay={50} />
            </div>
          </Col>
          <Col>
            <UserAuthForm></UserAuthForm>
          </Col>
        </Row>
        <Row>

        </Row>
      </Container>
    </>
  )
}