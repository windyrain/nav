import React, { useState } from 'react';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { ICategory } from '../../../types';
import styles from './Category.module.css';
import NavItem from './NavItem';
import SortableItem from './SortItem';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useClientStore } from '../../../store';

interface CategoryProps extends ICategory {
    categoryIndex: number;
    isEdit?: boolean;
}

export type Items = Array<{ id: number; name: string; url: string; urls?: Array<{ env: string; url: string }> }>;

const Category = (props: CategoryProps) => {
    const { name, categoryIndex, infos = [], isEdit } = props;
    const [items, setItems] = useState<Items>(infos.map((item, index) => ({ ...item, id: index })));
    const { department, sortNavData } = useClientStore(({ department, sortNavData }) => ({
        department,
        sortNavData,
    }));

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over?.id);

            const next = arrayMove(items, oldIndex, newIndex);

            setItems(next);

            sortNavData({
                departmentName: department,
                categoryName: name,
                categoryIndex: categoryIndex,
                sortIndexs: [Number(oldIndex), Number(newIndex)],
            });
        }
    };

    if (!isEdit) {
        return (
            <div>
                <p className={styles.category}>{name}</p>
                <div className={styles.grid}>
                    {items.map((subItem, i) => {
                        return <NavItem key={`${categoryIndex}_${i}`} categoryName={name} {...subItem} isEdit />;
                    })}
                </div>
            </div>
        );
    }

    return (
        <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]} sensors={sensors}>
            <div>
                <p className={styles.category}>{name}</p>
                <div className={styles.grid}>
                    <SortableContext items={items}>
                        {items.map((subItem) => {
                            return (
                                <SortableItem key={`${categoryIndex}_${subItem.id}`} id={subItem.id}>
                                    <NavItem categoryName={name} {...subItem} isEdit />
                                </SortableItem>
                            );
                        })}
                    </SortableContext>
                </div>
            </div>
        </DndContext>
    );
};

export default Category;
