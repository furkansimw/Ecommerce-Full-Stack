"use client";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";

type Props = {
  onSuccess: (token: string) => void;
  onError: () => void;
};

function GoogleButton({ onSuccess, onError }: Props) {
  return (
    <div className="google h-11 min-h11">
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        children={
          <GoogleLogin
            shape="rectangular"
            onError={onError}
            width={500}
            onSuccess={(r) => onSuccess(r.credential || "")}
          />
        }
      />
    </div>
  );
}

export default GoogleButton;
