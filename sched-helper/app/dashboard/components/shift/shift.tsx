import { Container, Row, Col, Table } from 'react-bootstrap';
import Element from './element';
import { ShiftConfig } from '../../shift_config_def';
import { useEffect, useState } from 'react';
import styles from './shift.module.css';

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
  props: ShiftConfig;
  content: ShiftContent;
  updateShiftContentElement: (name: string, col: number, val: string) => void;
}

export default function Shift({ props, content, updateShiftContentElement }: ShiftProps) {
  const numberOfWorkers = content.number_of_workers || 0;
  const days = content.days || 0;

  useEffect(() => {
    // Update local state here if needed
    console.log(content)
  }, [content]);

  return (
    <Container fluid>
      <Row>
        <Col>
          <Table responsive>
            <thead>
              <tr>
                {numberOfWorkers > 0 && <th className={styles.headcol}>Worker</th>}
                {Array.from({ length: days }).map((_, index) => (
                  <th key={index}>{index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: numberOfWorkers }).map((_, index) => {
                const shiftArray = content.content[index]?.shift_array || [];
                return (
                  <tr key={index}>
                    <Element
                      name={content.content[index].name}
                      col={-1}
                      key={index}
                      className={styles.headcol}
                      val={content.content[index].name}
                      onChangeElement={updateShiftContentElement}
                    />
                    {Array.from({ length: days }).map((_, index2) => (
                      <Element
                        name={content.content[index].name}
                        col={index2}
                        key={index2}
                        val={shiftArray[index2]}
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
