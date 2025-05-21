// import * as React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const GoogleOAuthFailure = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl text-center">Authentication Failed</CardTitle>
          <CardDescription className="text-center">
            There was a problem authenticating with Google. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              If you continue to experience issues, please contact support.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link to="/login">Return to Login</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link to="/">Go to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GoogleOAuthFailure;
