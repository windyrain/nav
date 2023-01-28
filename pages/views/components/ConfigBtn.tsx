import React from 'react';
import { Button, Group } from '@mantine/core';
import styles from './ConfigBtn.module.css';
import { useClientStore } from '../../../store';

function ConfigBtn() {
    return (
        <Group position="center">
            <Button
                className={styles.addBtn}
                variant="outline"
                color="yellow"
                onClick={() => {
                    useClientStore.setState({
                        isShowForm: 'create',
                        formData: {
                            department: useClientStore.getState().department,
                        },
                    });
                }}
            >
                新增导航
            </Button>
        </Group>
    );
}

export default ConfigBtn;
