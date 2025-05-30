import pool from '../database';
import { RoleOfContact } from '../../types/models';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export const roleOfContactService = {
    async create(roleContact: RoleOfContact): Promise<ResultSetHeader> {
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO role_of_contact 
            (Acc_ID, C_Role, Contact_ID, C_Relationship) 
            VALUES (?, ?, ?, ?)`,
            [
                roleContact.Acc_ID,
                roleContact.C_Role,
                roleContact.Contact_ID,
                roleContact.C_Relationship
            ]
        );
        return result;
    },

    async getAll(): Promise<RoleOfContact[]> {
        const [rows] = await pool.query<(RoleOfContact & RowDataPacket)[]>(
            'SELECT * FROM role_of_contact'
        );
        return rows;
    },

    async getByAccountId(accId: string): Promise<RoleOfContact[]> {
        const [rows] = await pool.execute<(RoleOfContact & RowDataPacket)[]>(
            'SELECT * FROM role_of_contact WHERE Acc_ID = ?',
            [accId]
        );
        return rows;
    },

    async getByContactId(contactId: string): Promise<RoleOfContact[]> {
        const [rows] = await pool.execute<(RoleOfContact & RowDataPacket)[]>(
            'SELECT * FROM role_of_contact WHERE Contact_ID = ?',
            [contactId]
        );
        return rows;
    },

    async update(accId: string, role: string, contactId: string, roleContact: Partial<RoleOfContact>): Promise<ResultSetHeader> {
        const [result] = await pool.execute<ResultSetHeader>(
            `UPDATE role_of_contact 
            SET C_Relationship = ?
            WHERE Acc_ID = ? AND C_Role = ? AND Contact_ID = ?`,
            [
                roleContact.C_Relationship,
                accId,
                role,
                contactId
            ]
        );
        return result;
    },

    async delete(accId: string, role: string, contactId: string): Promise<ResultSetHeader> {
        const [result] = await pool.execute<ResultSetHeader>(
            'DELETE FROM role_of_contact WHERE Acc_ID = ? AND C_Role = ? AND Contact_ID = ?',
            [accId, role, contactId]
        );
        return result;
    }
};
