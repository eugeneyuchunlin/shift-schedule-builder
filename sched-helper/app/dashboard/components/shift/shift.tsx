import { Container, Row, Col, Table } from 'react-bootstrap';
import Element from './element';
import { ShiftConfig } from '../../shift_config_def';
import { useEffect, useState, useContext } from 'react';
import styles from './shift.module.css';
import { ShiftContext } from '../contexts/shfit_context';
export interface PersonalShiftContent {
  name: string;
  shift_array: string[];
}

export interface ShiftContent {
  shift_name: string;
  shift_id: string;
  number_of_workers: number;
  days: number;
  content: PersonalShiftContent[];
}

interface ShiftProps {
  reset: boolean;
  brushMode: boolean;
  updateShiftContentElement: (name: string, col: number, val: string) => void;
}

export default function Shift({reset, brushMode, updateShiftContentElement }: ShiftProps) {

  const { shiftContent, shiftConfig } = useContext(ShiftContext)

  return (
    <Container fluid>
      <Row>
        <Col>
          <Table responsive>
            <thead>
              <tr>
                {shiftContent.number_of_workers> 0 && <th className={styles.headcol}>Worker</th>}
                {Array.from({ length: shiftContent.days }).map((_, index) => (
                  <th key={index}>{index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: shiftContent.number_of_workers }).map((_, index) => {
                const shiftArray = shiftContent.content[index]?.shift_array || [];
                return (
                  <tr key={index}>
                    <Element
                      name={shiftContent.content[index].name}
                      row={index}
                      col={-1}
                      key={index}
                      className={styles.headcol}
                      val={shiftContent.content[index].name}
                      reset={reset}
                      brushMode={brushMode}
                      onChangeElement={updateShiftContentElement}
                    />
                    {Array.from({ length: shiftContent.days }).map((_, index2) => (
                      <Element
                        name={shiftContent.content[index].name}
                        row={index}
                        col={index2}
                        key={index2}
                        val={shiftArray[index2]}
                        brushMode={brushMode}
                        reset={reset}
                        onChangeElement={updateShiftContentElement}
                      />
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
