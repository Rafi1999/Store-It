"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { sendEmailOTP, verifySecret } from "@/lib/actions/user.action";
import { useRouter } from "next/navigation";

const OTPModal = ({
  accountId,
  email,
}: {
  accountId: string;
  email: string;
}) => {
    const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Verify OTP
      const sessionId = await verifySecret({accountId,password});
      if(sessionId){
        router.push('/')
      }
    } catch (err) {
      console.log("Failed to verify otp ", err);
    }
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    try {
      // Resend OTP
      await sendEmailOTP({ email })
    } catch (err) {
      console.log("Failed to resend otp ", err);
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter your OTP
            <Image
              src="/assets/icons/close-dark.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => setIsOpen(false)}
              className="otp-close-button"
            ></Image>
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            We've sent an code to
            <span className="text-brand pl-1">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className="shad-otp">
            <InputOTPSlot index={0} className="shad-otp-slot" />
            <InputOTPSlot index={1} className="shad-otp-slot" />
            <InputOTPSlot index={2} className="shad-otp-slot" />
            <InputOTPSlot index={3} className="shad-otp-slot" />
            <InputOTPSlot index={4} className="shad-otp-slot" />
            <InputOTPSlot index={5} className="shad-otp-slot" />
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className="flex flex-col w-full gap-4">
            <AlertDialogAction onClick={handleSubmit} className="shad-submit-btn h-12" type="button">
                Submit
                {isLoading && (
                    <Image src="/assets/icons/loader.svg" alt="loader" width={24} height={24} className="ml-2 animate-spin"></Image>
                )}
            </AlertDialogAction>
            <div className="subtitle-2 mt-2 text-center text-light-100">
                Didn't get the code?
                <Button className="pl-1 text-brand" type="button" variant="link" onClick={handleResendOtp}>
                    Click to resend
                </Button>
            </div>
          </div>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OTPModal;
