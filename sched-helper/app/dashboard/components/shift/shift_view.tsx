'use client'

import {Container, Row, Col} from 'react-bootstrap'
import Banner from './banner'
import styles from './shift_view.module.css'

export default function ShiftView(){

    return (
        <>
            <Container className={styles.shift_container} fluid>
                <Row>
                    <Banner shift_name='Shift 1' />
                </Row>
                
            </Container> 
        </>
    )
}