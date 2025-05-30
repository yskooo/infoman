import pool from '../database';
import { ContactPersonDetails } from '../../types/models';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export const contactPersonService = {
    async create(contactPerson: ContactPersonDetails): Promise<ResultSetHeader> {
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO contact_person_details 
            (Contact_ID, C_Name, C_Address, C_Postal_Code, C_Email, C_Contact_Number) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                contactPerson.Contact_ID,
                contactPerson.C_Name,
                contactPerson.C_Address,
                contactPerson.C_Postal_Code,
                contactPerson.C_Email,
                contactPerson.C_Contact_Number
            ]
        );
        return result;
    },

    async getAll(): Promise<ContactPersonDetails[]> {
        const [rows] = await pool.query<(ContactPersonDetails & RowDataPacket)[]>(
            'SELECT * FROM contact_person_details'
        );
        return rows;
    },

    async getById(contactId: string): Promise<ContactPersonDetails | null> {
        const [rows] = await pool.execute<(ContactPersonDetails & RowDataPacket)[]>(
            'SELECT * FROM contact_person_details WHERE Contact_ID = ?',
            [contactId]
        );
        return rows[0] || null;
    },

    async update(contactId: string, contactPerson: Partial<ContactPersonDetails>): Promise<ResultSetHeader> {
        const [result] = await pool.execute<ResultSetHeader>(
            `UPDATE contact_person_details 
            SET C_Name = ?, C_Address = ?, C_Postal_Code = ?, C_Email = ?, C_Contact_Number = ? 
            WHERE Contact_ID = ?`,
            [
                contactPerson.C_Name,
                contactPerson.C_Address,
                contactPerson.C_Postal_Code,
                contactPerson.C_Email,
                contactPerson.C_Contact_Number,
                contactId
            ]
        );
        return result;
    },

    async delete(contactId: string): Promise<ResultSetHeader> {
        const [result] = await pool.execute<ResultSetHeader>(
            'DELETE FROM contact_person_details WHERE Contact_ID = ?',
            [contactId]
        );
        return result;
    }
};
