import pool from '../database';
import { SourceOfFunding } from '../../types/models';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export const sourceOfFundingService = {
    async create(funding: SourceOfFunding): Promise<ResultSetHeader> {
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO source_of_funding 
            (Funding_ID, Nature_of_Work, \`Business/School_Name\`, \`Office/School_Address\`, 
            \`Office/School_Number\`, Valid_ID, Source_of_Income) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                funding.Funding_ID,
                funding.Nature_of_Work,
                funding.Business_School_Name,
                funding.Office_School_Address,
                funding.Office_School_Number,
                funding.Valid_ID,
                funding.Source_of_Income
            ]
        );
        return result;
    },

    async getAll(): Promise<SourceOfFunding[]> {
        const [rows] = await pool.query<(SourceOfFunding & RowDataPacket)[]>(
            'SELECT * FROM source_of_funding'
        );
        return rows;
    },

    async getById(fundingId: string): Promise<SourceOfFunding | null> {
        const [rows] = await pool.execute<(SourceOfFunding & RowDataPacket)[]>(
            'SELECT * FROM source_of_funding WHERE Funding_ID = ?',
            [fundingId]
        );
        return rows[0] || null;
    },

    async update(fundingId: string, funding: Partial<SourceOfFunding>): Promise<ResultSetHeader> {
        const [result] = await pool.execute<ResultSetHeader>(
            `UPDATE source_of_funding 
            SET Nature_of_Work = ?, \`Business/School_Name\` = ?, \`Office/School_Address\` = ?, 
            \`Office/School_Number\` = ?, Valid_ID = ?, Source_of_Income = ? 
            WHERE Funding_ID = ?`,
            [
                funding.Nature_of_Work,
                funding.Business_School_Name,
                funding.Office_School_Address,
                funding.Office_School_Number,
                funding.Valid_ID,
                funding.Source_of_Income,
                fundingId
            ]
        );
        return result;
    },

    async delete(fundingId: string): Promise<ResultSetHeader> {
        const [result] = await pool.execute<ResultSetHeader>(
            'DELETE FROM source_of_funding WHERE Funding_ID = ?',
            [fundingId]
        );
        return result;
    }
};
