import Data from './data.json';

const departmentData = {
    name: '公司',
    children: Data.map((item) => item.name),
};

export default departmentData;
