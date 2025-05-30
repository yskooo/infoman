// Database Models
export interface BankDetails {
    Bank_Acc_No: string;
    Bank_Acc_Name: string;
    Bank_Acc_Date_of_Opening: Date;
    Bank_Name: string;
    Branch: string;
}

export interface PersonalData {
    Acc_ID: string;
    P_Name: string;
    P_Address: string;
    P_Postal_Code: string;
    P_Cell_Number: number;
    P_Email: string;
    Date_of_Birth: Date;
    Employment_Status: 'Employed' | 'Self-Employed' | 'Unemployed' | 'Student' | 'Retired';
    Purpose_of_Opening: 'Savings' | 'Investment' | 'Business' | 'Personal Use' | 'Others';
    Funding_ID: string;
    Bank_Acc_No: string;
}

export interface ContactPersonDetails {
    Contact_ID: string;
    C_Name: string;
    C_Address: string;
    C_Postal_Code: string;
    C_Email: string;
    C_Contact_Number: string;
}

export interface RoleOfContact {
    Acc_ID: string;
    C_Role: 'Kin' | 'Referee 1' | 'Referee 2';
    Contact_ID: string;
    C_Relationship: 'Father' | 'Mother' | 'Spouse' | 'Son' | 'Daughter' | 'Friend' | 'Colleague' | 'Mentor' | 'Others';
}

export interface SourceOfFunding {
    Funding_ID: string;
    Nature_of_Work: string;
    Business_School_Name: string;
    Office_School_Address: string;
    Office_School_Number: string;
    Valid_ID: 'Driver\'s License' | 'Passport' | 'SSS ID' | 'PhilHealth ID' | 'Others';
    Source_of_Income: 'Salary' | 'Business' | 'Remittance' | 'Scholarship' | 'Pension' | 'Others';
}

// Frontend Form Models
export interface RegistrationFormData {
    credentials: {
        email: string;
        password: string;
    };
    personalData: {
        P_Name: string;
        P_Address: string;
        P_Postal_Code: string;
        P_Cell_Number: number;
        P_Email: string;
        Date_of_Birth: Date;
        Employment_Status: PersonalData['Employment_Status'];
        Purpose_of_Opening: PersonalData['Purpose_of_Opening'];
    };
    fundingSource: {
        Nature_of_Work: string;
        Business_School_Name: string;
        Office_School_Address: string;
        Office_School_Number: string;
        Valid_ID: SourceOfFunding['Valid_ID'];
        Source_of_Income: SourceOfFunding['Source_of_Income'];
    };
    bankDetails: {
        Bank_Acc_Name: string;
        Bank_Acc_Date_of_Opening: Date;
        Bank_Name: string;
        Branch: string;
    };
    contacts: {
        contactDetails: {
            C_Name: string;
            C_Address: string;
            C_Postal_Code: string;
            C_Email: string;
            C_Contact_Number: string;
        };
        role: RoleOfContact['C_Role'];
        relationship: RoleOfContact['C_Relationship'];
    }[];
}

export interface LoginCredentials {
    email: string;
    password: string;
}
