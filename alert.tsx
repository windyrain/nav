import React from 'react';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons';

export function alert({ title, message = '', type }: { title: string; message?: string; type?: 'success' | 'fail' }) {
    if (type === 'success') {
        showNotification({
            title,
            message,
            icon: <IconCheck size={18} />,
            color: 'teal',
        });
        return;
    }

    if (type === 'fail') {
        showNotification({
            title,
            message,
            icon: <IconX size={18} />,
            color: 'red',
        });
        return;
    }

    showNotification({
        title,
        message,
    });
}
