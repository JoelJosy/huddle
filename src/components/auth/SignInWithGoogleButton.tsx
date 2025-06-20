"use client";

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/app/(auth)/login/actions";
import React from "react";

export const SignInWithGoogleButton = () => {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => {
          signInWithGoogle();
        }}
      >
        Login with Google
      </Button>
    </>
  );
};
