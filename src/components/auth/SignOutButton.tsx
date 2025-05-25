"use client";

import { Button } from "@/components/ui/button";

import React from "react";
import { logOut } from "@/app/(auth)/login/actions";

export const SignOutButton = () => {
  return (
    <>
      <Button
        type="button"
        variant="default"
        onClick={() => {
          logOut();
        }}
      >
        Sign Out
      </Button>
    </>
  );
};
