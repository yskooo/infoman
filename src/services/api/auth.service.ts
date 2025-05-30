import { ResultSetHeader, PoolConnection } from 'mysql2';
import { LoginCredentials, PersonalData, RegistrationFormData } from '../../types/models';
import pool from '../database';

export const authService = {
    async login(credentials: LoginCredentials): Promise<PersonalData | null> {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM personal_data WHERE P_Email = ?',
                [credentials.email]
            );
            
            if (Array.isArray(rows) && rows.length > 0) {
                // In a real application, you would verify the password here
                // For now, we'll just return the user data
                return rows[0] as PersonalData;
            }
            return null;
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Failed to authenticate user');
        }
    },

    async register(data: RegistrationFormData): Promise<PersonalData> {
        // Start a transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Generate IDs
            const accId = 'ACC' + Math.random().toString(36).substr(2, 6);
            const fundingId = 'FND' + Math.random().toString(36).substr(2, 6);
            const bankAccNo = 'BNK' + Math.random().toString(36).substr(2, 6);

            // Create funding source
            const [fundingResult] = await connection.execute<ResultSetHeader>(
                `INSERT INTO source_of_funding (
                    Funding_ID, Nature_of_Work, Business_School_Name, 
                    Office_School_Address, Office_School_Number, Valid_ID, Source_of_Income
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    fundingId,
                    data.fundingSource.Nature_of_Work,
                    data.fundingSource.Business_School_Name,
                    data.fundingSource.Office_School_Address,
                    data.fundingSource.Office_School_Number,
                    data.fundingSource.Valid_ID,
                    data.fundingSource.Source_of_Income
                ]
            );

            // Create bank details
            const [bankResult] = await connection.execute<ResultSetHeader>(
                `INSERT INTO bank_details (
                    Bank_Acc_No, Bank_Acc_Name, Bank_Acc_Date_of_Opening, Bank_Name, Branch
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    bankAccNo,
                    data.bankDetails.Bank_Acc_Name,
                    data.bankDetails.Bank_Acc_Date_of_Opening,
                    data.bankDetails.Bank_Name,
                    data.bankDetails.Branch
                ]
            );

            // Create personal data
            const [personalResult] = await connection.execute<ResultSetHeader>(
                `INSERT INTO personal_data (
                    Acc_ID, P_Name, P_Address, P_Postal_Code, P_Cell_Number,
                    P_Email, Date_of_Birth, Employment_Status, Purpose_of_Opening,
                    Funding_ID, Bank_Acc_No
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    accId,
                    data.personalData.P_Name,
                    data.personalData.P_Address,
                    data.personalData.P_Postal_Code,
                    data.personalData.P_Cell_Number,
                    data.personalData.P_Email,
                    data.personalData.Date_of_Birth,
                    data.personalData.Employment_Status,
                    data.personalData.Purpose_of_Opening,
                    fundingId,
                    bankAccNo
                ]
            );

            // Create contacts and their roles
            for (const contact of data.contacts) {
                const contactId = 'CNT' + Math.random().toString(36).substr(2, 6);

                // Create contact person details
                const [contactResult] = await connection.execute<ResultSetHeader>(
                    `INSERT INTO contact_person_details (
                        Contact_ID, C_Name, C_Address, C_Postal_Code, C_Email, C_Contact_Number
                    ) VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        contactId,
                        contact.contactDetails.C_Name,
                        contact.contactDetails.C_Address,
                        contact.contactDetails.C_Postal_Code,
                        contact.contactDetails.C_Email,
                        contact.contactDetails.C_Contact_Number
                    ]
                );

                // Create role of contact
                const [roleResult] = await connection.execute<ResultSetHeader>(
                    `INSERT INTO role_of_contact (
                        Acc_ID, C_Role, Contact_ID, C_Relationship
                    ) VALUES (?, ?, ?, ?)`,
                    [
                        accId,
                        contact.role,
                        contactId,
                        contact.relationship
                    ]
                );
            }

            // Commit the transaction
            await connection.commit();

            // Return the created user data
            const [userData] = await connection.execute(
                'SELECT * FROM personal_data WHERE Acc_ID = ?',
                [accId]
            );

            return (Array.isArray(userData) ? userData[0] : null) as PersonalData;
        } catch (error) {
            // If there's an error, rollback the transaction
            await connection.rollback();
            console.error('Registration error:', error);
            throw new Error('Failed to register user');
        } finally {
            connection.release();
        }
    }
};
