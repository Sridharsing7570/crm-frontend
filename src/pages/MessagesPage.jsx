import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setMessages(data.data || []);
      setLoading(false);
    }
    fetchMessages();
  }, [token]);

  const markAsRead = async (id) => {
    await fetch(
      `${import.meta.env.VITE_BACKEND_URI}/notifications/${id}/mark-read`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setMessages((msgs) =>
      msgs.map((m) => (m._id === id ? { ...m, isRead: true } : m))
    );
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 flex justify-center">
      <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/90">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Mail className="h-6 w-6 text-blue-500" /> Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No messages.</div>
          ) : (
            <ul className="space-y-3">
              {messages.map((msg) => (
                <li
                  key={msg._id}
                  className={`flex items-start gap-3 p-4 rounded-lg shadow-sm border transition-all duration-200 ${
                    msg.isRead
                      ? "bg-gray-100 border-gray-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="pt-1">
                    {msg.isRead ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Mail className="h-5 w-5 text-blue-500 animate-bounce" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-base mb-1">
                      {msg.message}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(msg.createdAt).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                  {!msg.isRead && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsRead(msg._id)}
                    >
                      Mark as read
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
