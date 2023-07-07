import React, { useState } from 'react';
import styles from './tagbox.module.css';
import Tag from './tag';
import { TagProps, TagParameter, TagsDefinition } from './tags_definition';


export default function TagBox() {

    const [initialTags, setinitialTags] = useState<TagProps[]>(TagsDefinition);


    const [addedTags, setAddedTags] = useState<TagProps[]>([]);

    const addTag = (tag: TagProps) => {
        const updatedTags = initialTags.filter((t) => t !== tag);
        setinitialTags(updatedTags);

        const updatedAddedTags = [...addedTags, tag];
        setAddedTags(updatedAddedTags)
    };

    const removeTag = (tag: TagProps) => {
        const updatedTags = addedTags.filter((t) => t !== tag);
        setAddedTags(updatedTags);

        const updatedInitialTags = [...initialTags, tag];
        setinitialTags(updatedInitialTags)
    }



    return (
        <div className={styles.tagBox}>
            <div className={styles.tagList}>
                {initialTags.map((tag, index) => (
                    <Tag key={index} props={tag} plus={true} action={() => addTag(tag)} />
                ))}
            </div>
            <div className={styles.boxWrapper}>
                <div className={`${styles.tagList}`}>
                    {addedTags.map((tag, index) => (
                        <Tag key={index} props={tag} plus={false} action={() => removeTag(tag)} />
                    ))}
                </div>
            </div>
        </div>
    );
}
