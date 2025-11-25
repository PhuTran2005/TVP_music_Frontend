import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Palette,
  Volume2,
  Download,
  Smartphone,
  Globe,
  CreditCard,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Slider } from "../components/ui/slider";

export function SettingsPage() {
  const [theme, setTheme] = useState("system");
  const [notifications, setNotifications] = useState({
    newReleases: true,
    playlists: true,
    followers: false,
    email: true,
    push: false,
  });
  const [audioQuality, setAudioQuality] = useState([320]);
  const [autoDownload, setAutoDownload] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  const settingsSections = [
    {
      id: "account",
      label: "Account",
      icon: User,
      description: "Manage your profile and account settings",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Control when and how you receive notifications",
    },
    {
      id: "privacy",
      label: "Privacy",
      icon: Shield,
      description: "Manage your privacy and security settings",
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: Palette,
      description: "Customize the look and feel of the app",
    },
    {
      id: "playback",
      label: "Playback",
      icon: Volume2,
      description: "Audio quality and playback preferences",
    },
    {
      id: "downloads",
      label: "Downloads",
      icon: Download,
      description: "Manage offline content and storage",
    },
  ];

  return (
    <div className="container px-4 lg:px-6 py-8 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-lg text-muted-foreground">
          Customize your MusicHub experience
        </p>
      </motion.div>

      <Tabs defaultValue="account" className="w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Sidebar Navigation */}
          <div className="lg:w-80">
            <TabsList className="grid w-full grid-cols-1 h-auto p-1">
              {settingsSections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TabsTrigger
                      value={section.id}
                      className="w-full justify-start p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{section.label}</div>
                        <div className="text-xs opacity-80 hidden sm:block">
                          {section.description}
                        </div>
                      </div>
                    </TabsTrigger>
                  </motion.div>
                );
              })}
            </TabsList>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {/* Account Settings */}
            <TabsContent value="account">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="Alex" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Johnson" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="alex@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        defaultValue="Music enthusiast and playlist curator. Always discovering new sounds and sharing them with the world."
                      />
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Push Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>New Releases</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when artists you follow release new music
                        </p>
                      </div>
                      <Switch
                        checked={notifications.newReleases}
                        onCheckedChange={(checked: boolean) =>
                          setNotifications({
                            ...notifications,
                            newReleases: checked,
                          })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Playlist Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when playlists you follow are updated
                        </p>
                      </div>
                      <Switch
                        checked={notifications.playlists}
                        onCheckedChange={(checked: boolean) =>
                          setNotifications({
                            ...notifications,
                            playlists: checked,
                          })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>New Followers</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when someone follows you
                        </p>
                      </div>
                      <Switch
                        checked={notifications.followers}
                        onCheckedChange={(checked: boolean) =>
                          setNotifications({
                            ...notifications,
                            followers: checked,
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Communication Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked: boolean) =>
                          setNotifications({ ...notifications, email: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Mobile Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications on mobile devices
                        </p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked: boolean) =>
                          setNotifications({ ...notifications, push: checked })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Visibility</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Public Profile</Label>
                        <p className="text-sm text-muted-foreground">
                          Make your profile visible to other users
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Recently Played</Label>
                        <p className="text-sm text-muted-foreground">
                          Display your recently played music on your profile
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Allow Friend Suggestions</Label>
                        <p className="text-sm text-muted-foreground">
                          Let others find you through mutual connections
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Data & Privacy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Download Your Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Privacy Policy
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Theme</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Color Theme</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Display</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Compact Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Show more content in less space
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Album Art</Label>
                        <p className="text-sm text-muted-foreground">
                          Display album artwork in player
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Playback Settings */}
            <TabsContent value="playback">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Audio Quality</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Label>Streaming Quality</Label>
                        <span className="text-sm text-muted-foreground">
                          {audioQuality[0]} kbps
                        </span>
                      </div>
                      <Slider
                        value={audioQuality}
                        onValueChange={setAudioQuality}
                        max={320}
                        min={96}
                        step={32}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>96 kbps</span>
                        <span>160 kbps</span>
                        <span>320 kbps</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Crossfade</Label>
                        <p className="text-sm text-muted-foreground">
                          Smoothly transition between songs
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Normalize Volume</Label>
                        <p className="text-sm text-muted-foreground">
                          Keep volume consistent across all songs
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Downloads Settings */}
            <TabsContent value="downloads">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Offline Music</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto Download</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically download liked songs for offline
                          listening
                        </p>
                      </div>
                      <Switch
                        checked={autoDownload}
                        onCheckedChange={setAutoDownload}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Offline Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Only play downloaded music
                        </p>
                      </div>
                      <Switch
                        checked={offlineMode}
                        onCheckedChange={setOfflineMode}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Download Quality</Label>
                        <p className="text-sm text-muted-foreground">
                          Quality for offline downloads
                        </p>
                      </div>
                      <Select defaultValue="high">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="very-high">Very High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Storage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Downloaded Music</span>
                      <span className="text-muted-foreground">2.4 GB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Cache</span>
                      <span className="text-muted-foreground">485 MB</span>
                    </div>
                    <Separator />
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        Clear Cache
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Manage Downloads
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </div>
        </motion.div>
      </Tabs>
    </div>
  );
}
