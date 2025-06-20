import { useState, useEffect } from "react";

import {
  Users,
  Activity,
  TrendingUp,
  CheckCircle,
  Plus,
  Mail,
  Calendar,
  Settings,
} from "lucide-react";
import { ThemeProvider } from "@/context/theme-context";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { StatsCard } from "@/components/StatsCard";
import { TaskItem } from "@/components/TaskItem";
import {
  fetchJobs,
  fetchNotifications,
  fetchUser,
  createJob,
  sendNotification,
} from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [projectForm, setProjectForm] = useState({
    companyName: "",
    jobTitle: "",
    status: "Applied",
    notes: "",
  });
  const [messageForm, setMessageForm] = useState({ message: "" });
  const [meetingForm, setMeetingForm] = useState({
    title: "",
    date: "",
    notes: "",
  });
  const [meetings, setMeetings] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // TODO: Replace with real token logic
  const token = localStorage.getItem("token") || "demo-token";

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [jobsData, notificationsData, userData] = await Promise.all([
          fetchJobs(token),
          fetchNotifications(token),
          fetchUser(token),
        ]);

        setTasks(jobsData?.data || []);
        setNotifications(notificationsData.data.length || 0);
        setUser(userData.data);

        // Dynamic stats calculation
        const jobs = jobsData?.data || [];
        const totalJobs = jobs.length;
        console.log(" Jobs:", jobs);
        const activeProjects = jobs.filter(
          (j) =>
            j.status?.toLowerCase() === "applied" ||
            j.status?.toLowerCase() === "interview"
        ).length;
        const tasksDone = jobs.filter((j) =>
          ["accepted", "completed", "done"].includes(
            (j.status || "").toLowerCase()
          )
        ).length;
        // If you have revenue in jobs, sum it; otherwise, omit revenue stat

        setStats([
          {
            label: "Total Jobs",
            value: totalJobs,
            icon: Users,
            color: "text-blue-600",
          },
          {
            label: "Active Projects",
            value: activeProjects,
            icon: Activity,
            color: "text-green-600",
          },
          {
            label: "Tasks Done",
            value: tasksDone,
            icon: CheckCircle,
            color: "text-orange-600",
          },
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token]);

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  console.log("Tasks after toggle:", tasks);

  const completedTasks = tasks?.filter((task) => task.completed).length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  // Handlers for modals
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setActionError("");
    setActionSuccess("");
    try {
      await createJob(token, projectForm);
      setActionSuccess("Project created successfully!");
      setShowProjectModal(false);
      setProjectForm({
        companyName: "",
        jobTitle: "",
        status: "Applied",
        notes: "",
      });
      // Refresh jobs
      const jobsData = await fetchJobs(token);
      setTasks(jobsData.data || []);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setActionError("");
    setActionSuccess("");
    try {
      await sendNotification(token, messageForm.message);
      setActionSuccess("Message sent successfully!");
      setShowMessageModal(false);
      setMessageForm({ message: "" });
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleScheduleMeeting = (e) => {
    e.preventDefault();
    setMeetings((prev) => [...prev, { ...meetingForm, id: Date.now() }]);
    setActionSuccess("Meeting scheduled!");
    setShowMeetingModal(false);
    setMeetingForm({ title: "", date: "", notes: "" });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        {/* Alerts for actions */}
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          {actionError && (
            <Alert variant="destructive" className="mb-2">
              <AlertDescription>{actionError}</AlertDescription>
            </Alert>
          )}
          {actionSuccess && (
            <Alert variant="success" className="mb-2">
              <AlertDescription>{actionSuccess}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Main area: Sidebar + Content */}
        <div className="min-h-screen flex ">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <div className="flex-1 flex flex-col">
            <Header
              onMenuClick={() => setSidebarOpen(!sidebarOpen)}
              notifications={notifications}
            />

            <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold tracking-tight">
                    {user
                      ? `Welcome back, ${user.name || user.username || "User"}!`
                      : "Welcome!"}
                  </h1>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Here's what's happening with your projects today.
                  </p>
                </div>

                {loading ? (
                  <div>Loading...</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                      {stats.map((stat, index) => (
                        <StatsCard key={index} {...stat} />
                      ))}
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700">
                          <div className="space-y-4 p-6">
                            <div>
                              <h3 className="text-lg font-semibold">
                                Project Progress
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Your current project completion status
                              </p>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span>Overall Progress</span>
                                  <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                                  <div
                                    className="h-full w-full flex-1 bg-primary transition-all"
                                    style={{
                                      width: `${progress}%`,
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="space-y-3">
                                {tasks.map((task) => (
                                  <TaskItem
                                    key={task.id}
                                    id={task.id}
                                    title={task.title}
                                    completed={task.completed}
                                    onToggle={toggleTask}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700">
                          <div className="space-y-4 p-6">
                            <div>
                              <h3 className="text-lg font-semibold">
                                Quick Actions
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Frequently used actions
                              </p>
                            </div>
                            <div className="space-y-4">
                              <Button
                                className="w-full"
                                onClick={() => setShowProjectModal(true)}
                              >
                                <Plus className="h-4 w-4 mr-2" /> Create New
                                Project
                              </Button>
                              <Button
                                className="w-full"
                                onClick={() => setShowMessageModal(true)}
                              >
                                <Mail className="h-4 w-4 mr-2" /> Send Message
                              </Button>
                              <Button
                                className="w-full"
                                onClick={() => setShowMeetingModal(true)}
                              >
                                <Calendar className="h-4 w-4 mr-2" /> Schedule
                                Meeting
                              </Button>
                              <Button className="w-full">
                                <Settings className="h-4 w-4 mr-2" /> Manage
                                Settings
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Meetings List */}
                      {meetings.length > 0 && (
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold mb-2">
                            Scheduled Meetings
                          </h3>
                          <ul className="space-y-2">
                            {meetings.map((m) => (
                              <li
                                key={m.id}
                                className="border rounded p-3 bg-white dark:bg-gray-800"
                              >
                                <div className="font-medium">{m.title}</div>
                                <div className="text-sm text-gray-500">
                                  {m.date}
                                </div>
                                <div className="text-sm">{m.notes}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </main>
          </div>
        </div>
        {/* Modals */}
        {showProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Create New Project</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <Input
                    placeholder="Company Name"
                    value={projectForm.companyName}
                    onChange={(e) =>
                      setProjectForm((f) => ({
                        ...f,
                        companyName: e.target.value,
                      }))
                    }
                    required
                  />
                  <Input
                    placeholder="Job Title"
                    value={projectForm.jobTitle}
                    onChange={(e) =>
                      setProjectForm((f) => ({
                        ...f,
                        jobTitle: e.target.value,
                      }))
                    }
                    required
                  />
                  <Input
                    placeholder="Status (Applied, Interview, Offer, etc)"
                    value={projectForm.status}
                    onChange={(e) =>
                      setProjectForm((f) => ({ ...f, status: e.target.value }))
                    }
                  />
                  <Textarea
                    placeholder="Notes"
                    value={projectForm.notes}
                    onChange={(e) =>
                      setProjectForm((f) => ({ ...f, notes: e.target.value }))
                    }
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowProjectModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={actionLoading}>
                      {actionLoading ? "Creating..." : "Create"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
        {showMessageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Send Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <Textarea
                    placeholder="Your message"
                    value={messageForm.message}
                    onChange={(e) =>
                      setMessageForm({ message: e.target.value })
                    }
                    required
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowMessageModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={actionLoading}>
                      {actionLoading ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
        {showMeetingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Schedule Meeting</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleScheduleMeeting} className="space-y-4">
                  <Input
                    placeholder="Meeting Title"
                    value={meetingForm.title}
                    onChange={(e) =>
                      setMeetingForm((f) => ({ ...f, title: e.target.value }))
                    }
                    required
                  />
                  <Input
                    type="datetime-local"
                    value={meetingForm.date}
                    onChange={(e) =>
                      setMeetingForm((f) => ({ ...f, date: e.target.value }))
                    }
                    required
                  />
                  <Textarea
                    placeholder="Notes"
                    value={meetingForm.notes}
                    onChange={(e) =>
                      setMeetingForm((f) => ({ ...f, notes: e.target.value }))
                    }
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowMeetingModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Schedule</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}
