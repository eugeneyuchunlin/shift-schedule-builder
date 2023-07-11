import { useState, useEffect, useContext } from 'react';
import { Container, OffcanvasBody, Row } from 'react-bootstrap';
import Banner from './banner';
import Shift, { ShiftContent } from './shift';
import styles from './shift_view.module.css';
import { ShiftConfig } from '../../shift_config_def';
import { ShiftContext } from '../contexts/shfit_context';


export default function ShiftView(
    { reset, reloadShiftContent, setDefaultShiftContent, updateShiftContentElement }: 
    { reset: boolean, reloadShiftContent: () => void, setDefaultShiftContent: () => void, updateShiftContentElement: (name: string, col: number, val: string) => void }
) {
    const { shiftContent, shiftConfig } = useContext(ShiftContext)
    return (
        <>
            {shiftConfig.shift_id ? (
                <Container className={styles.shift_container} fluid>
                    <Row>
                        <Banner 
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
