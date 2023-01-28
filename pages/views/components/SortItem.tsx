import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem(props: any) {
    const { id, children } = props;
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id,
    });

    const style = {
        transform: transform
            ? CSS.Transform.toString({
                  ...transform,
                  scaleX: 1,
                  scaleY: 1,
              })
            : '',
        transition,
    };

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={{ ...style }}>
            {children}
        </div>
    );
}

export default SortableItem;
