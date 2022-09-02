import md5 from 'blueimp-md5';

export async function md5Password(password: string) {
    const hashedPassword = await md5(password, 'ksdh');
    return hashedPassword;
}
