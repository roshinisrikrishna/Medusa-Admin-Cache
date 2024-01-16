import React, { useState } from 'react';
import { requestPasswordReset } from './resetPassword';
import { useAdminSendResetPasswordToken, useAdminResetPassword } from "medusa-react";


const PasswordResetComponent = () => {
    // States to store email and token (received from user input or other sources)
    const [email, setEmail] = useState('');
    // const [token, setToken] = useState(''); // Token usually obtained from email link or similar

    // const { requestReset, resetPasswordFn } = requestPasswordReset();

    const sendResetPasswordToken = useAdminSendResetPasswordToken();
    const resetPassword = useAdminResetPassword();

    const handleRequestPasswordReset = () => {
        console.log("email at handleRequestPasswordReset ",email)
    sendResetPasswordToken.mutate({ email });
    console.log("token ",    sendResetPasswordToken.mutate({ email }))

    };

    const handleResetPassword = () => {
        // console.log("token ",token)
        // resetPassword.mutate({
        //     token,
        //     password: email,
        //   });
        // resetPasswordFn(token, email);
    };

    return (
        <div>
            {/* Input fields for email and token */}
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
            />
            {/* <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your token"
            /> */}

            {/* Buttons to trigger password reset and set new password */}
            <button onClick={handleRequestPasswordReset}>Request Password Reset</button>
            <button onClick={handleResetPassword}>Reset Password</button>
        </div>
    );
};

export default PasswordResetComponent;
