'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/app/components/navbar';
import { Container, Row, Col, Button, Offcanvas, Nav } from '@/app/components/bootstrap';
import ShiftBlock from './shift_block';
import styles from './history_shift.module.css';
import { StringMappingType } from 'typescript';

export default function HistoryShifts({onSelectShift}:{onSelectShift: (shift_name: string, shift_id: string) => void}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // load shifts
    const loadShifts = async () => {
      fetch('/dashboard/api/shifts/history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json()).then((json) => {
        const newShifts = json.data.map((shift: any) => {
          return { name: shift.shift_name, id: shift.shift_id };
        });
        setShifts(newShifts);
      })

    };

    loadShifts();
  }, [])

  type ShiftDataType = {
    name: string;
    id: string;
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
      onSelectShift(shift_name, json.shift_id)
    }catch(err){
      console.log(err);
    }
  };

  const saveShiftName = async (id: string, name: string) => {
    try{
      const res = await fetch('/dashboard/api/shifts/rename', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({shift_id: id, name: name}),
      });
      const json = await res.json();
      console.log(json);
    }catch(err){
      console.log(err);
    }
  }

  const updateShiftName = async (id: string, name: string) => {
    const newShiftsList = shifts.map((shift) => {
      if (shift.id === id) {
        return { ...shift, name: name };
      }
      return shift;
    });
    await saveShiftName(id, name);
    setShifts(newShiftsList);
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
              <ShiftBlock 
                key={shift.id} 
                shift_id={shift.id} 
                name={shift.name} 
                onSelectShift={(name:string, shift_id:string) => {onSelectShift(name, shift_id), setShow(false)}}
                onRenameShift={updateShiftName}
              />
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
