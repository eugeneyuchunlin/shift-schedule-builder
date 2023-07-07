'use client'
import Image from 'next/image'
import styles from './banner.module.css'
import {Container, Row, Col, Navbar, Nav} from 'react-bootstrap'

export default function Banner({shift_name} : {shift_name: string}){
    return (
        <>
            <Navbar>
                <Container>
                    <Navbar.Brand>
                        {shift_name}
                    </Navbar.Brand>
                    <Col sm={7}></Col>
                    <Col>
                        <Image className={styles.icon} src="/run.svg" width={30} height={30} alt="run"></Image>
                    </Col>
                    <Col>
                        <Image className={styles.icon} src="/reset.svg" width={30} height={30} alt="reset"></Image>
                    </Col>
                    <Col>
                        <Image className={styles.icon} src="/info.svg" width={30} height={30} alt="Info"></Image>
                    </Col>
                    <Col>
                        <Image className={styles.icon} src="/download.svg" width={30} height={30} alt="download"></Image>
                    </Col>
                    <Col>
                        <Image className={styles.icon} src="/save.svg" width={30} height={30} alt="save"></Image>
                    </Col>
                </Container>
            </Navbar> 
        </>
    )
}