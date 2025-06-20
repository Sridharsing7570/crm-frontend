import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, Plus, FileText, Trash2 } from "lucide-react";

export default function CalendarPage() {
  const [meetings, setMeetings] = useState([]);
  const [form, setForm] = useState({ title: "", date: "", notes: "" });

  useEffect(() => {
    // Using in-memory storage instead of localStorage for Claude.ai compatibility
    const stored = meetings;
    setMeetings(stored);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleAdd = () => {
    if (!form.title.trim() || !form.date) return;

    const newMeeting = {
      ...form,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...meetings, newMeeting];
    setMeetings(updated);
    setForm({ title: "", date: "", notes: "" });
  };

  const handleDelete = (id) => {
    const updated = meetings.filter((m) => m.id !== id);
    setMeetings(updated);
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow =
      date.toDateString() ===
      new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();

    const timeStr = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) return `Today at ${timeStr}`;
    if (isTomorrow) return `Tomorrow at ${timeStr}`;
    return `${date.toLocaleDateString()} at ${timeStr}`;
  };

  const sortedMeetings = [...meetings].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Meeting Scheduler
          </h1>
          <p className="text-gray-600">
            Organize and track your upcoming meetings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Meeting Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                  <Plus className="h-5 w-5 text-indigo-500" />
                  Schedule Meeting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Meeting Title
                    </label>
                    <Input
                      name="title"
                      placeholder="Enter meeting title..."
                      value={form.title}
                      onChange={handleChange}
                      className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Date & Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        name="date"
                        type="datetime-local"
                        value={form.date}
                        onChange={handleChange}
                        className="pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Textarea
                        name="notes"
                        placeholder="Add meeting notes, agenda, or details..."
                        value={form.notes}
                        onChange={handleChange}
                        className="pl-10 resize-none border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleAdd}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Meetings List */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                  <Users className="h-5 w-5 text-indigo-500" />
                  Upcoming Meetings
                  <span className="ml-auto text-sm font-normal bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                    {meetings.length} total
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {sortedMeetings.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <Calendar className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No meetings scheduled
                      </h3>
                      <p className="text-gray-500">
                        Schedule your first meeting to get started!
                      </p>
                    </div>
                  ) : (
                    sortedMeetings.map((meeting, index) => {
                      const isUpcoming = new Date(meeting.date) > new Date();
                      const isPast = new Date(meeting.date) < new Date();

                      return (
                        <div
                          key={meeting.id}
                          className={`group relative p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                            isUpcoming
                              ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300"
                              : isPast
                              ? "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 opacity-75"
                              : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div
                                className={`p-2 rounded-lg ${
                                  isUpcoming
                                    ? "bg-blue-100"
                                    : isPast
                                    ? "bg-gray-100"
                                    : "bg-green-100"
                                }`}
                              >
                                <Users
                                  className={`h-5 w-5 ${
                                    isUpcoming
                                      ? "text-blue-600"
                                      : isPast
                                      ? "text-gray-600"
                                      : "text-green-600"
                                  }`}
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                                  {meeting.title}
                                </h3>

                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                  <Clock className="h-4 w-4" />
                                  <span className="font-medium">
                                    {formatDateTime(meeting.date)}
                                  </span>
                                  {isPast && (
                                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                                      Past
                                    </span>
                                  )}
                                  {isUpcoming && (
                                    <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-full">
                                      Upcoming
                                    </span>
                                  )}
                                </div>

                                {meeting.notes && (
                                  <p className="text-gray-700 text-sm leading-relaxed">
                                    {meeting.notes}
                                  </p>
                                )}
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(meeting.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
