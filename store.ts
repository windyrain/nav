import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { alert } from './alert';
import { server } from './constants';
import { DATA_TYPE } from './pages/api/navData/type';
import { NavData } from './types';

interface ICreateParams {
    departmentName?: string;
    categoryName?: string;
    navName?: string;
    navUrl?: string;
    navUrls?: Array<{ env: string; url: string }>;
}

interface IUpdateParams {
    departmentName?: string;
    categoryName?: string;
    navName?: string;
    updateInfo: {
        departmentName?: string;
        categoryName?: string;
        navName?: string;
        navUrl?: string;
        navUrls?: Array<{ env: string; url: string }>;
    };
}

interface IDeleteParams {
    departmentName?: string;
    categoryName?: string;
    navName?: string;
}

interface ISortParams {
    departmentName?: string;
    categoryIndex: number;
    categoryName?: string;
    sortIndexs: number[];
}

interface NavState {
    isServer: boolean;
    isShowForm: 'create' | 'update' | false;
    formData?: {
        department: string;
        category?: string;
        name?: string;
        url?: string;
    };
    selectData: { label: string; value: string }[];
    department: string;
    navData: NavData;
    changeDepartment: (department: string) => void;
    setNavData: (navData: NavData) => void;
    fetchNavData: () => Promise<void>;
    createNavData: (params: ICreateParams) => Promise<boolean>;
    updateNavData: (params: IUpdateParams) => Promise<boolean>;
    deleteNavData: (params: IDeleteParams) => Promise<boolean>;
    sortNavData: (params: ISortParams) => Promise<boolean>;
}

const emptyAsyncFunc = async () => {
    return true;
};

const initialState: NavState = {
    isServer: true,
    isShowForm: false,
    department: '',
    navData: {},
    selectData: [],
    changeDepartment: (department: string) => {},
    setNavData: (navData: NavData) => {},
    fetchNavData: async () => {},
    createNavData: emptyAsyncFunc,
    updateNavData: emptyAsyncFunc,
    deleteNavData: emptyAsyncFunc,
    sortNavData: emptyAsyncFunc,
};

const request = async ({ url, params }: { url: string; params: any }) => {
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                type: DATA_TYPE.Nav,
                ...params,
            }),
        });

        const result = await res.json();

        if (result.code === 0) {
            return null;
        } else {
            return result.message;
        }
    } catch (e: any) {
        return e.message;
    }
};

export const useClientStore = create<NavState>()(
    persist(
        (set, get) => ({
            ...initialState,
            isServer: false as boolean,
            isShowForm: false as 'create' | 'update' | false,
            changeDepartment: (department) => {
                set({
                    department,
                });
            },
            setNavData: (navData: NavData) => {
                set({
                    navData,
                    selectData: navData[get().department || '前端'].map((item) => ({
                        label: item.name,
                        value: item.name,
                    })),
                });
            },
            fetchNavData: async () => {
                const res = await fetch(`${server}/api/navData/query`);

                let data = {};

                try {
                    const result = await res.json();
                    data = result.data;
                    set({
                        navData: data,
                    });
                } catch (e) {
                    console.log('刷新出错');
                }
            },
            createNavData: async (params) => {
                const res = await request({
                    url: `${server}/api/navData/create`,
                    params: {
                        type: DATA_TYPE.Nav,
                        ...params,
                    },
                });

                if (!res) {
                    alert({
                        title: '创建成功',
                        type: 'success',
                    });
                    return true;
                }

                alert({
                    title: '创建失败',
                    message: res,
                    type: 'fail',
                });

                return false;
            },
            updateNavData: async (params) => {
                const res = await request({
                    url: `${server}/api/navData/update`,
                    params: {
                        type: DATA_TYPE.Nav,
                        ...params,
                    },
                });

                if (!res) {
                    alert({
                        title: '修改成功',
                        type: 'success',
                    });
                    return true;
                }

                alert({
                    title: '修改失败',
                    message: res,
                    type: 'fail',
                });

                return false;
            },
            deleteNavData: async (params) => {
                const res = await request({
                    url: `${server}/api/navData/delete`,
                    params: {
                        type: DATA_TYPE.Nav,
                        ...params,
                    },
                });

                if (!res) {
                    alert({
                        title: '删除成功',
                        type: 'success',
                    });
                    return true;
                }

                alert({
                    title: '删除失败',
                    message: res,
                    type: 'fail',
                });

                return false;
            },
            sortNavData: async (params) => {
                const { navData } = get();
                const copyNavData = JSON.stringify(navData);

                const res = await request({
                    url: `${server}/api/navData/sort`,
                    params: {
                        ...params,
                    },
                });

                if (!res) {
                    alert({
                        title: '交换成功',
                        type: 'success',
                    });
                    return true;
                }

                alert({
                    title: '交换失败',
                    message: res,
                    type: 'fail',
                });

                set({
                    navData: JSON.parse(copyNavData),
                });

                return false;
            },
        }),
        {
            name: '@nav',
            // ...
            partialize: (state) => ({ department: state.department }),
        },
    ),
);

const useServerStore = (...args: Parameters<typeof useClientStore>) => {
    const store = useClientStore(...args);
    const [isHydrated, setHydrated] = useState(false);
    useEffect(() => setHydrated(true), []);

    return isHydrated ? store : args[0](initialState);
};

export default useServerStore as typeof useClientStore;
