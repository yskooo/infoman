import pool from '../database';
import { BankDetails } from '../../types/models';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export const bankDetailsService = {
    async create(bankDetails: BankDetails): Promise<ResultSetHeader> {
        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO bank_details (Bank_Acc_No, Bank_Acc_Name, Bank_Acc_Date_of_Opening, Bank_Name, Branch) VALUES (?, ?, ?, ?, ?)',
            [bankDetails.Bank_Acc_No, bankDetails.Bank_Acc_Name, bankDetails.Bank_Acc_Date_of_Opening, bankDetails.Bank_Name, bankDetails.Branch]
        );
        return result;
    },

    async getAll(): Promise<BankDetails[]> {
        const [rows] = await pool.query<(BankDetails & RowDataPacket)[]>('SELECT * FROM bank_details');
        return rows;
    },

    async getById(bankAccNo: string): Promise<BankDetails | null> {
        const [rows] = await pool.execute<(BankDetails & RowDataPacket)[]>(
            'SELECT * FROM bank_details WHERE Bank_Acc_No = ?',
            [bankAccNo]
        );
        return rows[0] || null;
    },

    async update(bankAccNo: string, bankDetails: Partial<BankDetails>): Promise<ResultSetHeader> {
        const [result] = await pool.execute<ResultSetHeader>(
            'UPDATE bank_details SET Bank_Acc_Name = ?, Bank_Acc_Date_of_Opening = ?, Bank_Name = ?, Branch = ? WHERE Bank_Acc_No = ?',
            [bankDetails.Bank_Acc_Name, bankDetails.Bank_Acc_Date_of_Opening, bankDetails.Bank_Name, bankDetails.Branch, bankAccNo]
        );
        return result;
    },

    async delete(bankAccNo: string): Promise<ResultSetHeader> {
        const [result] = await pool.execute<ResultSetHeader>(
            'DELETE FROM bank_details WHERE Bank_Acc_No = ?',
            [bankAccNo]
        );
        return result;
    }
};
