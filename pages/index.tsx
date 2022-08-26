import type { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import emitter from '../emitter';
import CascadeDropDown from './views/components/CascadeDropDown';
import NavItem from './views/components/NavItem';
import styles from './style.module.css';

type Department = string;
type NavData = Record<
    string,
    Array<{ name: string; infos: Array<{ name: string; url: string; urls?: Array<{ env: string; url: string }> }> }>
>;

const dev = process.env.NODE_ENV !== 'production';
export const server = dev ? 'http://localhost:3000' : 'https://nav.oneadvise.cn';

export const getStaticProps = async () => {
    const res = await fetch(`${server}/api/navData/query`);

    let data = {};

    try {
        const result = await res.json();
        data = result.data;
    } catch (e) {
        console.log('请求出错');
    }

    return {
        props: { data: data as NavData }, // will be passed to the page component as props
    };
};

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
    const [navData, setNavData] = useState<NavData>(props.data);
    const keys = Object.keys(navData);
    const [department, setDepartment] = useState<Department>('');

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`${server}/api/navData/query`);

            let data = {};

            try {
                const result = await res.json();
                data = result.data;

                setNavData(data);

                const func = (department: string) => {
                    if (Object.keys(data).includes(department)) {
                        setDepartment(department as Department);
                    } else {
                        setDepartment('前端');
                    }
                };

                const text = localStorage.getItem('@nav/deprtment') || '请选择';
                func(text);

                emitter.on('departmentChange', (department: string) => {
                    func(department);
                });
            } catch (e) {
                console.log('请求出错');
            }
        }
        fetchData();
    }, []);

    if (!navData || keys.length === 0) return null;

    return (
        <div className={styles.container}>
            <Head>
                <title>凯叔 - 导航</title>
                <meta name="description" content="让工作更高效" />
                <link rel="icon" href="/next-assets/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div className={styles.topContainer}>
                    <h1 className={styles.title}>凯叔导航</h1>
                    <p className={styles.description}>让工作更高效</p>
                    <CascadeDropDown departmentData={keys} />
                </div>
                {department !== '' &&
                    navData[department].map((item, i) => {
                        return (
                            <div key={`${item.name}_i`}>
                                <p className={styles.category}>{item.name}</p>
                                <div className={styles.grid} key={item.name}>
                                    {item.infos.map((subItem, j) => {
                                        return <NavItem key={`${item.name}_${i}_${j}`} {...subItem} />;
                                    })}
                                </div>
                            </div>
                        );
                    })}
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://kaishu.feishu.cn/wiki/wikcnCfgjJ0NyIz3cebDXzb1qjc"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    凯叔前端出品 - <span className={styles.know}>了解我们</span>
                </a>
            </footer>
        </div>
    );
};

export default Home;
