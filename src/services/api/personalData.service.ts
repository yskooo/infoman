import pool from '../database';
import { PersonalData } from '../../types/models';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export const personalDataService = {
    async create(personalData: PersonalData): Promise<ResultSetHeader> {
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO personal_data 
            (Acc_ID, P_Name, P_Address, P_Postal_Code, P_Cell_Number, P_Email, 
            Date_of_Birth, Employment_Status, Purpose_of_Opening, Funding_ID, Bank_Acc_No) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                personalData.Acc_ID,
                personalData.P_Name,
                personalData.P_Address,
                personalData.P_Postal_Code,
                personalData.P_Cell_Number,
                personalData.P_Email,
                personalData.Date_of_Birth,
                personalData.Employment_Status,
                personalData.Purpose_of_Opening,
                personalData.Funding_ID,
                personalData.Bank_Acc_No
            ]
        );
        return result;
    },

    async getAll(): Promise<PersonalData[]> {
        const [rows] = await pool.query<(PersonalData & RowDataPacket)[]>('SELECT * FROM personal_data');
        return rows;
    },

    async getById(accId: string): Promise<PersonalData | null> {
        const [rows] = await pool.execute<(PersonalData & RowDataPacket)[]>(
            'SELECT * FROM personal_data WHERE Acc_ID = ?',
            [accId]
        );
        return rows[0] || null;
    },

    async update(accId: string, personalData: Partial<PersonalData>): Promise<ResultSetHeader> {
        const [result] = await pool.execute<ResultSetHeader>(
            `UPDATE personal_data 
            SET P_Name = ?, P_Address = ?, P_Postal_Code = ?, P_Cell_Number = ?, 
            P_Email = ?, Date_of_Birth = ?, Employment_Status = ?, Purpose_of_Opening = ?, 
            Funding_ID = ?, Bank_Acc_No = ? 
            WHERE Acc_ID = ?`,
            [
                personalData.P_Name,
                personalData.P_Address,
                personalData.P_Postal_Code,
                personalData.P_Cell_Number,
                personalData.P_Email,
                personalData.Date_of_Birth,
                personalData.Employment_Status,
                personalData.Purpose_of_Opening,
                personalData.Funding_ID,
                personalData.Bank_Acc_No,
                accId
            ]
        );
        return result;
    },

    async delete(accId: string): Promise<ResultSetHeader> {
        const [result] = await pool.execute<ResultSetHeader>(
            'DELETE FROM personal_data WHERE Acc_ID = ?',
            [accId]
        );
        return result;
    }
};
