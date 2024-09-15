import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { client, sender } from "./mailtrap.config.js";

const sendVerificationEmail = async (email, verificationToken)=>{
    const recipient = [{email}];
    try{
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html:  VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
            category: "Email Verification"
        });
        console.log("Email sent successfully ", response);
    }catch(error){
        console.log("Error sending Email", error);
    }
}

const sendWelcomeEmail = async (email, name)=>{
    const recipient = [{email}];
    try{
        const response = await client.send({
            from: sender,
            to: recipient,
            template_uuid: "99572101-4f36-4a93-aa03-1b59b5e58d2e",
            template_variables: {
            "name": name,
            "company_info_name": "Auth Company"
            }
        });
        console.log("Welcome email sent successfully ", response);
    }catch(error){
        console.log("Error sending welcome email ", error);
    }
}

const sendPasswordResetRequestEmail = async (email, resetURL)=>{
    const recipient = [{email}];
    try{
        const response = await client.send({
            to: recipient,
            from: sender,
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
            category: 'forgot password'
        });
    }catch(error){
        console.log("Cannot send Password Reset Email ",error);
    }
}

const sendPasswordResetSuccessEmail = async (email)=>{
    const recipient = [{email}];
    try{
        const response = await client.send({
            from: sender,
            to: recipient,
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: 'password reset'
        });
        console.log("Password Reset Successful");
    }catch(error){
        console.log("Password reset failed ", error);
    }
}
export {sendVerificationEmail, sendWelcomeEmail, sendPasswordResetRequestEmail, sendPasswordResetSuccessEmail};