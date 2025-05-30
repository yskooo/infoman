import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { RegistrationStepper } from "@/components/auth/RegistrationStepper";
import { AccountStep } from "@/components/auth/registration/AccountStep";
import { PersonalDetailsStep } from "@/components/auth/registration/PersonalDetailsStep";
import { FundingSourceStep } from "@/components/auth/registration/FundingSourceStep";
import { BankingDetailsStep } from "@/components/auth/registration/BankingDetailsStep";
import { ContactsStep } from "@/components/auth/registration/ContactsStep";
import { ReviewStep } from "@/components/auth/registration/ReviewStep";
import { RegistrationFormData } from "@/types/models";
import { authService } from "@/services/api/auth.service";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<RegistrationFormData>({
    credentials: {
      email: "",
      password: ""
    },
    personalData: {
      P_Name: "",
      P_Address: "",
      P_Postal_Code: "",
      P_Cell_Number: 0,
      P_Email: "",
      Date_of_Birth: new Date(),
      Employment_Status: "Employed",
      Purpose_of_Opening: "Savings"
    },
    fundingSource: {
      Nature_of_Work: "",
      Business_School_Name: "",
      Office_School_Address: "",
      Office_School_Number: "",
      Valid_ID: "Passport",
      Source_of_Income: "Salary"
    },
    bankDetails: {
      Bank_Acc_Name: "",
      Bank_Acc_Date_of_Opening: new Date(),
      Bank_Name: "",
      Branch: ""
    },
    contacts: []
  });

  // Handle account credentials
  const handleAccountSubmit = (data: { email: string; password: string }) => {
    setFormData(prev => ({
      ...prev,
      credentials: data,
      personalData: {
        ...prev.personalData,
        P_Email: data.email
      }
    }));
    setCurrentStep(1);
  };

  // Handle personal details
  const handlePersonalDetailsSubmit = (data: Omit<RegistrationFormData["personalData"], "P_Email">) => {
    setFormData(prev => ({
      ...prev,
      personalData: {
        ...prev.personalData,
        ...data
      }
    }));
    setCurrentStep(2);
  };

  // Handle funding source
  const handleFundingSourceSubmit = (data: RegistrationFormData["fundingSource"]) => {
    setFormData(prev => ({
      ...prev,
      fundingSource: data
    }));
    setCurrentStep(3);
  };

  // Handle banking details
  const handleBankingDetailsSubmit = (data: RegistrationFormData["bankDetails"]) => {
    setFormData(prev => ({
      ...prev,
      bankDetails: data
    }));
    setCurrentStep(4);
  };

  // Handle contacts
  const handleContactsSubmit = (contacts: RegistrationFormData["contacts"]) => {
    setFormData(prev => ({
      ...prev,
      contacts
    }));
    setCurrentStep(5);
  };

  // Handle final submission
  const handleSubmitRegistration = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await authService.register(formData);
      
      if (response) {
        toast({
          description: "Your account has been created successfully! Please log in.",
        });
        
        // Redirect to login page
        navigate("/login");
      } else {
        toast({
          variant: "destructive",
          description: "Failed to create account. Please try again.",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error 
          ? `Registration failed: ${error.message}` 
          : "Failed to create account. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container max-w-4xl py-10 md:py-16 px-4">
        <Card className="glass-card overflow-hidden border-muted/50">
          <CardContent className="p-6 md:p-8 pb-8">
            <RegistrationStepper 
              currentStep={currentStep} 
              setCurrentStep={setCurrentStep}
              formData={formData}
            />
            
            <div className="mt-8">
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-muted-foreground mt-1">
                      Enter your credentials to begin the registration process.
                    </p>
                  </div>
                  
                  <AccountStep 
                    onNext={handleAccountSubmit}
                    defaultValues={formData.credentials}
                  />
                  
                  <div className="text-center text-sm pt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </div>
                </div>
              )}
              
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold">Personal Information</h1>
                    <p className="text-muted-foreground mt-1">
                      Please provide your personal details.
                    </p>
                  </div>
                  
                  <PersonalDetailsStep 
                    onNext={handlePersonalDetailsSubmit}
                    onBack={() => setCurrentStep(0)}
                    defaultValues={formData.personalData}
                  />
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold">Source of Funding</h1>
                    <p className="text-muted-foreground mt-1">
                      We need to understand your source of income for regulatory compliance.
                    </p>
                  </div>
                  
                  <FundingSourceStep 
                    onNext={handleFundingSourceSubmit}
                    onBack={() => setCurrentStep(1)}
                    defaultValues={formData.fundingSource}
                  />
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold">Banking Details</h1>
                    <p className="text-muted-foreground mt-1">
                      Please provide information about your existing bank account.
                    </p>
                  </div>
                  
                  <BankingDetailsStep 
                    onNext={handleBankingDetailsSubmit}
                    onBack={() => setCurrentStep(2)}
                    defaultValues={formData.bankDetails}
                  />
                </div>
              )}
              
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold">Emergency Contacts & References</h1>
                    <p className="text-muted-foreground mt-1">
                      Add at least one emergency contact (kin) and optional references.
                    </p>
                  </div>
                  
                  <Alert className="bg-muted/50 mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Required Information</AlertTitle>
                    <AlertDescription>
                      You must add at least one contact with the role "Kin" to proceed.
                    </AlertDescription>
                  </Alert>
                  
                  <ContactsStep 
                    onNext={handleContactsSubmit}
                    onBack={() => setCurrentStep(3)}
                    defaultValues={formData.contacts}
                  />
                </div>
              )}
              
              {currentStep === 5 && (
                <div className="space-y-6">
                  <ReviewStep 
                    data={formData}
                    onBack={() => setCurrentStep(4)}
                    onSubmit={handleSubmitRegistration}
                    isSubmitting={isSubmitting}
                  />
                  
                  <Alert variant="default" className="bg-primary/10 border-primary/20 mt-6">
                    <Check className="h-4 w-4 text-primary" />
                    <AlertTitle>Application ready for submission</AlertTitle>
                    <AlertDescription className="text-muted-foreground">
                      By clicking submit, you agree to our Terms of Service and Privacy Policy. 
                      Your application will be reviewed within 1-2 business days.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default Register;
