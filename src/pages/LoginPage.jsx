import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Github,
  Chrome,
  Moon,
  Sun,
  ArrowRight,
  Shield,
  Zap,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`${provider} login would be handled here`);
    }, 1500);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"
      }`}
    >
      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDarkMode(!darkMode)}
          className={`rounded-full p-3 transition-all duration-300 ${
            darkMode
              ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
              : "bg-white/80 hover:bg-white text-gray-600 shadow-lg backdrop-blur-sm"
          }`}
        >
          {darkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex min-h-screen">
        {/* Left side - Branding/Info */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-3xl" />
          <div className="relative z-10">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p
                className={`text-xl leading-relaxed ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Sign in to access your dashboard and manage your projects with
                ease.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: Shield,
                  title: "Secure Access",
                  desc: "Enterprise-grade security for your data",
                },
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  desc: "Optimized performance for seamless experience",
                },
                {
                  icon: Users,
                  title: "Team Collaboration",
                  desc: "Work together with your team members",
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div
                    className={`p-3 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                      darkMode
                        ? "bg-gray-800 text-blue-400"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full border-2 ${
                      darkMode
                        ? "border-gray-800 bg-gray-700"
                        : "border-white bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-medium">Join 10,000+ users</p>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Trusted by teams worldwide
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8">
          <div className="w-full max-w-md">
            <Card
              className={`border-0 shadow-2xl backdrop-blur-sm transition-all duration-300 ${
                darkMode
                  ? "bg-gray-800/80 shadow-black/20"
                  : "bg-white/90 shadow-gray-200/50"
              }`}
            >
              <CardHeader className="space-y-1 pb-6">
                <div className="flex items-center justify-center mb-6">
                  <div
                    className={`p-3 rounded-full ${
                      darkMode ? "bg-blue-500/20" : "bg-blue-100"
                    }`}
                  >
                    <Lock className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center font-bold">
                  Sign In
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full h-11 transition-all duration-300 hover:scale-105"
                    onClick={() => handleSocialLogin("Google")}
                    disabled={isLoading}
                  >
                    <Chrome className="h-5 w-5 mr-3" />
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-11 transition-all duration-300 hover:scale-105"
                    onClick={() => handleSocialLogin("GitHub")}
                    disabled={isLoading}
                  >
                    <Github className="h-5 w-5 mr-3" />
                    Continue with GitHub
                  </Button>
                </div> */}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div
                      className={`w-full border-t ${
                        darkMode ? "border-gray-700" : "border-gray-300"
                      }`}
                    />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span
                      className={`px-2 ${
                        darkMode
                          ? "bg-gray-800 text-gray-400"
                          : "bg-white text-gray-500"
                      }`}
                    >
                      Or continue with email
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 h-11 transition-all duration-300 focus:scale-105"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 h-11 transition-all duration-300 focus:scale-105"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={setRememberMe}
                      />
                      <Label htmlFor="remember" className="text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Forgot password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Sign In</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Don't have an account?{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto font-semibold"
                      onClick={() => navigate("/register")}
                    >
                      Sign up here
                    </Button>
                  </p>
                </div>

                <div
                  className={`text-center text-xs ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  <p>Demo credentials: demo@example.com / password</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
