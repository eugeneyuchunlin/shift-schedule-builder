'use client';

import React, { useState } from 'react';
import Navbar from '@/app/components/navbar';
import { Container, Row, Col, Button, Offcanvas, Nav } from '@/app/components/bootstrap';
import ShiftBlock from './shift_block';
import styles from './history_shift.module.css';

export default function HistoryShifts() {
  const [show, setShow] = useState(false);

  type ShiftDataType = {
    name: string;
    id: number;
  }

  const [shifts, setShifts] = useState<ShiftDataType[]>([]);

  const addShift = () => {
    const newShifts = [...shifts, { name: 'shift name' + shifts.length, id: shifts.length }];
    setShifts(newShifts);

    // TODO: save to database
  };

  return (
    <>
      <Navbar items={[<Nav.Link key={1} onClick={() => setShow(true)}>Your Shifts</Nav.Link>]}>
      </Navbar>

      <Offcanvas show={show} onHide={() => setShow(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Shifts</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Container>
            <Row>
              <hr />
            </Row>
          </Container>
          <Container className={styles.history_shifts_container} fluid>
            {shifts.map((shift) => (
              <ShiftBlock key={shift.id} name={shift.name} />
            ))}
          </Container>
          <Container className={styles.history_shifts_operation} fluid>
            <Row>
              <hr />
            </Row>
            <Row>
              <Button className={styles.add_shift_button} variant="light" onClick={addShift}>
                +
              </Button>
            </Row>
          </Container>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
