import { Account } from "../../generated-api";
import accountRepository from "../../repositories/accountRepository";

const accountHelper = {
    checkIsUserNameAvailable,
    checkIsEmailAvailable
}

async function checkIsUserNameAvailable(userName: string): Promise<boolean> {
    const account: Account | null = await accountRepository.getAccountByUserName(userName);
    return account === null;
}
async function checkIsEmailAvailable(email: string): Promise<boolean> {
    const account: Account | null = await accountRepository.getAccountByEmail(email);
    return account === null;
}

export default accountHelper;

