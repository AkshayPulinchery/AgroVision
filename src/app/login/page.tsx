"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sprout, Loader2 } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl relative z-10 overflow-hidden">
        <div className="h-2 bg-primary w-full" />
        <CardHeader className="text-center pt-8">
          <div className="mx-auto bg-primary/10 p-4 rounded-2xl w-fit mb-4">
            <Sprout className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold">Welcome Back</CardTitle>
          <CardDescription>
            AgriYield AI: Smart Farming for a Sustainable Future
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <Button 
            variant="outline" 
            className="w-full h-14 text-lg font-bold gap-4 border-2 hover:bg-muted/50 transition-all"
            onClick={handleGoogleLogin}
          >
            <Image 
              src="https://images.unsplash.com/gh/nextjs-icons/google.svg" 
              alt="Google" 
              width={24} 
              height={24} 
            />
            Sign in with Google
          </Button>
          
          <p className="text-center text-xs text-muted-foreground px-4 leading-relaxed">
            By signing in, you agree to our Terms of Service and Privacy Policy regarding your farm's telemetry data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
