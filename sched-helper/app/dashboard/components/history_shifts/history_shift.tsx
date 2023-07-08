'use client';

import React, { useState } from 'react';
import Navbar from '@/app/components/navbar';
import { Container, Row, Col, Button, Offcanvas, Nav } from '@/app/components/bootstrap';
import ShiftBlock from './shift_block';
import styles from './history_shift.module.css';

export default function HistoryShifts({onSelectShift}:{onSelectShift: (shift_id: string) => void}) {
  const [show, setShow] = useState(false);

  type ShiftDataType = {
    name: string;
    id: number;
  }

  const [shifts, setShifts] = useState<ShiftDataType[]>([]);

  const addShift = async () => {
    const shift_name = 'Untitled ' + shifts.length;
    
    try{
      const res = await fetch('/dashboard/api/shifts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: shift_name}),
      });
      const json = await res.json();
      const newShifts = [...shifts, { name: shift_name, id: json.shift_id }];
      setShifts(newShifts);
      onSelectShift(json.shift_id)
    }catch(err){
      console.log(err);
    }
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
              <ShiftBlock key={shift.id} name={shift.name} onSelectShift={onSelectShift}/>
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
