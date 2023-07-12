import React, { useState } from 'react';
import styles from './tagbox.module.css';
import Tag from './tag';
import { TagProps, TagParameter, TagsDefinition } from './tags_definition';
import { Constraint } from '../../shift_config_def';


export default function TagBox({onAddingShiftConstraint, onRemovingConstraint} : {onAddingShiftConstraint: (constraint: Constraint)=>void, onRemovingConstraint: (constraint_name: string)=>void}){

    return (
        <div className={styles.tagBox}>
            <div className={styles.tagList}>
                {TagsDefinition.map((tag, index) => (
                    <Tag 
                        
                        key={index} 
                        props={tag} 
                        onAddingShiftConstraint={onAddingShiftConstraint} 
                        onRemovingShiftConstraint={onRemovingConstraint} 
                    />
                ))}
            </div>
        </div>
    );
}
