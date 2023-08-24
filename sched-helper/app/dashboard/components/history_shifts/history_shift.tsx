'use client';

import React, { useState, useEffect, use } from 'react';
import Navbar from '@/app/components/navbar';
import { Container, Row, Col, Button, Offcanvas, Nav } from '@/app/components/bootstrap';
import ShiftBlock from './shift_block';
import styles from './history_shift.module.css';
import { StringMappingType } from 'typescript';
import { UserContext } from '../contexts/user_context';
import { useContext } from 'react';

export default function HistoryShifts(
  {onSelectShift}:{onSelectShift: (shift_name: string, shift_id: string) => void}) {
  const [show, setShow] = useState(false);

  const { user } = useContext(UserContext);
  // console.log("user id : ", user.user.user.id);

  useEffect(() => {
    // load shifts
    const loadShifts = async () => {
      fetch('/dashboard/api/shifts/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.user.user.id }),
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
        body: JSON.stringify({name: shift_name, user_id: user.user.user.id}),
      });
      const json = await res.json();
      const newShifts = [...shifts, { name: shift_name, id: json.shift_id }];
      setShifts(newShifts);
      onSelectShift(shift_name, json.shift_id)
    }catch(err){
      console.log(err);
    }
  };

  const deleteShift = async (id: string) => {
      try{
        const res = await fetch('/dashboard/api/shifts/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({shift_id: id}),
        });
        const json = await res.json();
        console.log(json);

        const newShiftsList = shifts.filter((shift) => shift.id !== id);
        setShifts(newShiftsList);
        if(newShiftsList.length > 0){
          onSelectShift(newShiftsList[newShiftsList.length - 1].name, newShiftsList[newShiftsList.length - 1].id);
        }else{
          onSelectShift("", "");
        }

      }catch(err){
        console.log(err);
      }
  }

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
      
      <Navbar offcanvas={[<Nav.Link key={1} onClick={() => setShow(true)}>Your Shifts</Nav.Link>]}>
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
                onDeleteShift={deleteShift}
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
