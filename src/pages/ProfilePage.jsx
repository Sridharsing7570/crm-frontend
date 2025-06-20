import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data.data);
        setForm({
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          password: "",
        });
      } catch (err) {
        setError("Failed to load user info");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Update failed");
      setSuccess("Profile updated!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <Card className="w-full max-w-lg shadow-xl border-0 bg-white/90">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <Avatar className="w-20 h-20 mb-2">
            <AvatarFallback>
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">Profile</CardTitle>
          <div className="text-gray-500 text-sm">{user.email}</div>
          <div className="text-xs text-purple-600 font-semibold uppercase tracking-wider">
            {user.role}
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="success">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <Input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <Input
              name="password"
              type="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
            />
            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
