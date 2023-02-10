import { Modal, TextInput, Button, Group, Box, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useClientStore } from '../../../store';

function NavForm() {
    const { isShowForm, formData, selectData, createNavData, updateNavData, fetchNavData } = useClientStore(
        ({ isShowForm, formData, selectData, createNavData, updateNavData, fetchNavData }) => ({
            isShowForm,
            formData,
            selectData,
            createNavData,
            updateNavData,
            fetchNavData,
        }),
    );

    const form = useForm({
        initialValues: formData,
        validate: (values) => ({
            department: values.department === undefined ? '请选择部门' : null,
            category: values.category === undefined ? '请选择分类' : null,
            name: values.name === undefined ? '请填写名称' : null,
            url: values.url === undefined ? '请填写地址' : null,
        }),
    });

    const text = isShowForm === 'create' ? '新增' : '修改';

    return (
        <Modal
            opened
            onClose={() => {
                form.reset();
                useClientStore.setState({
                    isShowForm: false,
                });
            }}
            title={`${text}导航`}
        >
            <Box sx={{ maxWidth: 600 }} mx="auto">
                <form>
                    <TextInput withAsterisk label="部门" disabled {...form.getInputProps('department')} />
                    <Select
                        mt="md"
                        label="分类"
                        placeholder="选择一个分类"
                        data={selectData}
                        disabled={isShowForm === 'update'}
                        {...form.getInputProps('category')}
                    />
                    <TextInput
                        mt="md"
                        withAsterisk
                        label="名称"
                        placeholder="请输入名称"
                        {...form.getInputProps('name')}
                    />
                    <TextInput
                        mt="md"
                        withAsterisk
                        label="链接"
                        placeholder="请输入链接"
                        {...form.getInputProps('url')}
                    />
                    <Group position="right" mt="md">
                        <Button
                            type="button"
                            onClick={async () => {
                                if (form.isValid()) {
                                    let result = false;

                                    if (isShowForm === 'create') {
                                        result = await createNavData({
                                            departmentName: form.values.department,
                                            categoryName: form.values.category,
                                            navName: form.values.name,
                                            navUrl: form.values.url,
                                        });
                                    } else if (formData) {
                                        result = await updateNavData({
                                            departmentName: formData.department,
                                            categoryName: formData.category,
                                            navName: formData.name,
                                            updateInfo: {
                                                departmentName: form.values.department,
                                                categoryName: form.values.category,
                                                navName: form.values.name,
                                                navUrl: form.values.url,
                                            },
                                        });
                                    }

                                    if (result) {
                                        fetchNavData();
                                        form.reset();
                                        useClientStore.setState({
                                            isShowForm: false,
                                        });
                                    }
                                }
                            }}
                        >
                            {text}
                        </Button>
                    </Group>
                </form>
            </Box>
        </Modal>
    );
}

export default NavForm;
