'use client'

import {Container, Row, Col} from 'react-bootstrap'
import Banner from './banner'
import Shift from './shift'
import styles from './shift_view.module.css'
import { ShiftConfig } from '../../shift_config_def'

export default function ShiftView({props} : {props: ShiftConfig}){
    

    return (
        <>
        {
            props.shift_id ? <>
                <Container className={styles.shift_container} fluid>
                    <Row>
                        <Banner shift_name={props.name} />
                    </Row>
                    <Row>
                        <hr />
                    </Row> 
                    <Row>
                        <Shift props={props}/>
                    </Row> 
                </Container> 
            </> : <h1>Select a shift</h1>
        }
            
        </>
    )
}