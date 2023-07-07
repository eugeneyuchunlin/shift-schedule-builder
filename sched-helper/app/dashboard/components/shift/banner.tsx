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
                    <Col sm={9}>
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