import { useAdminSendResetPasswordToken, useAdminResetPassword } from "medusa-react";

// Function to request a password reset token
export const requestPasswordReset = (email) => {

    const sendResetPasswordToken = useAdminSendResetPasswordToken();
  const resetPassword = useAdminResetPassword();

  console.log("email at resetpassword ",email)

  const requestReset = (email) => {
    sendResetPasswordToken.mutate({ email });
  };

  const resetPasswordFn = (token, email) => {
    resetPassword.mutate({
      token,
      password: email,
    });
  };

  return { requestReset, resetPasswordFn };
};
