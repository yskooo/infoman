import pool from '../database';

export interface BankDetails {
    Bank_Acc_No: string;
    Bank_Acc_Name: string;
    Bank_Acc_Date_of_Opening: Date;
    Bank_Name: string;
    Branch: string;
}

export const bankDetailsService = {
    // Create
    async create(bankDetails: BankDetails) {
        const [result] = await pool.execute(
            'INSERT INTO bank_details (Bank_Acc_No, Bank_Acc_Name, Bank_Acc_Date_of_Opening, Bank_Name, Branch) VALUES (?, ?, ?, ?, ?)',
            [bankDetails.Bank_Acc_No, bankDetails.Bank_Acc_Name, bankDetails.Bank_Acc_Date_of_Opening, bankDetails.Bank_Name, bankDetails.Branch]
        );
        return result;
    },

    // Read all
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM bank_details');
        return rows;
    },

    // Read one
    async getById(bankAccNo: string) {
        const [rows] = await pool.execute('SELECT * FROM bank_details WHERE Bank_Acc_No = ?', [bankAccNo]);
        return rows[0];
    },

    // Update
    async update(bankAccNo: string, bankDetails: Partial<BankDetails>) {
        const [result] = await pool.execute(
            'UPDATE bank_details SET Bank_Acc_Name = ?, Bank_Acc_Date_of_Opening = ?, Bank_Name = ?, Branch = ? WHERE Bank_Acc_No = ?',
            [bankDetails.Bank_Acc_Name, bankDetails.Bank_Acc_Date_of_Opening, bankDetails.Bank_Name, bankDetails.Branch, bankAccNo]
        );
        return result;
    },

    // Delete
    async delete(bankAccNo: string) {
        const [result] = await pool.execute('DELETE FROM bank_details WHERE Bank_Acc_No = ?', [bankAccNo]);
        return result;
    }
};
