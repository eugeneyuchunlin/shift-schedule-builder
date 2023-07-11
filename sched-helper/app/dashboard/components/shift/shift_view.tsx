import { useState, useEffect } from 'react';
import { Container, OffcanvasBody, Row } from 'react-bootstrap';
import Banner from './banner';
import Shift, { ShiftContent } from './shift';
import styles from './shift_view.module.css';
import { ShiftConfig } from '../../shift_config_def';

export default function ShiftView(
    { props, shiftContent, reset, reloadShiftContent, setDefaultShiftContent, updateShiftContentElement }: 
    { props: ShiftConfig, shiftContent: ShiftContent, reset: boolean, reloadShiftContent: () => void, setDefaultShiftContent: () => void, updateShiftContentElement: (name: string, col: number, val: string) => void }
) {

    return (
        <>
            {props.shift_id ? (
                <Container className={styles.shift_container} fluid>
                    <Row>
                        <Banner 
                            props={props} 
                            shift_content={shiftContent} 
                            reloadShiftContent={reloadShiftContent}
                            setDefaultShiftContent={setDefaultShiftContent}
                        />
                    </Row>
                    <Row>
                        <hr />
                    </Row>
                    <Row>
                        <Shift
                            reset={reset}
                            props={props}
                            content={shiftContent}
                            updateShiftContentElement={updateShiftContentElement}
                        />
                    </Row>
                </Container>
            ) : (
                <Container className={styles.empty_shift} fluid>
                    <span className={styles.text}>Create or choose a shift to start</span>
                </Container>
            )}
        </>
    );
}
