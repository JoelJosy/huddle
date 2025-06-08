import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Users,
  ShieldCheck,
  Lightbulb,
  Settings,
} from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ - Huddle",
  description: "Frequently asked questions about the Huddle platform",
};

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            Support
          </Badge>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
            Find answers to common questions about using Huddle. Can't find what
            you're looking for? Contact our support team.
          </p>
        </div>

        <Tabs defaultValue="general" className="w-ful">
          <TabsList className="mb-8 grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Groups</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
          </TabsList>

          {/* General Questions */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  General Questions
                </CardTitle>
                <CardDescription>
                  Basic information about the Huddle platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="what-is-huddle">
                    <AccordionTrigger>What is Huddle?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Huddle is an AI-powered collaborative study platform
                        that helps students and learners create and share study
                        notes, join study groups, and generate AI flashcards.
                        Our mission is to make learning more effective and
                        collaborative.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="is-huddle-free">
                    <AccordionTrigger>Is Huddle free to use?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Yes, Huddle's core features are free to use. We offer a
                        basic plan that includes creating notes, joining study
                        groups, and limited AI flashcard generation. We also
                        offer premium plans with additional features and higher
                        usage limits.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="supported-devices">
                    <AccordionTrigger>
                      What devices can I use Huddle on?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Huddle is a web-based platform that works on any device
                        with a modern web browser. This includes desktops,
                        laptops, tablets, and smartphones. We're also working on
                        native mobile apps that will be available soon.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="data-privacy">
                    <AccordionTrigger>
                      How does Huddle handle my data?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        We take data privacy seriously. Your personal
                        information is encrypted and securely stored. We never
                        sell your data to third parties. You can control the
                        visibility of your notes and choose what information is
                        shared with study groups. For more details, please
                        review our Privacy Policy.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Questions */}
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Notes
                </CardTitle>
                <CardDescription>
                  Questions about creating and sharing notes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="create-note">
                    <AccordionTrigger>How do I create a note?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        To create a note, navigate to the Notes section from
                        your dashboard and click on "Create Note". You'll be
                        taken to our rich text editor where you can add content,
                        format text, and add images. Fill in the title, subject,
                        and optional tags, then click "Save Note" to publish it.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="note-visibility">
                    <AccordionTrigger>Who can see my notes?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        By default, notes are set to public visibility, meaning
                        they can be discovered by other users. You can change
                        this setting when creating or editing a note to make it
                        private (visible only to you) or shared with specific
                        study groups.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="edit-delete-note">
                    <AccordionTrigger>
                      Can I edit or delete my notes?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Yes, you can edit or delete any note you've created. To
                        do this, go to "My Notes" in the Notes section, find the
                        note you want to modify, and click on the edit or delete
                        icon. Changes to notes are saved automatically when you
                        edit them.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="note-formatting">
                    <AccordionTrigger>
                      What formatting options are available for notes?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Our note editor supports rich text formatting including
                        headings, bold, italic, underline, lists, code blocks,
                        quotes, and more. You can also add images, links, and
                        tables to your notes. We're continuously adding new
                        formatting features to enhance your note-taking
                        experience.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Groups Questions */}
          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Study Groups
                </CardTitle>
                <CardDescription>
                  Questions about study groups and collaboration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="create-group">
                    <AccordionTrigger>
                      How do I create a study group?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        To create a study group, go to the Groups section from
                        your dashboard and click "Create Group". Fill in the
                        group name, description, and set member limits. You can
                        choose to make the group public (anyone can join) or
                        private (invitation only).
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="join-group">
                    <AccordionTrigger>
                      How do I join an existing group?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        You can browse public groups in the Groups section and
                        click "Join Group" on any group you'd like to join. For
                        private groups, you'll need an invitation from the group
                        owner or an existing member with invitation privileges.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="group-chat">
                    <AccordionTrigger>
                      How does group chat work?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Each study group has a real-time chat feature where
                        members can communicate. Messages are displayed
                        chronologically, and you'll see when other members were
                        last active. You can send text messages, and we're
                        working on adding support for sharing files and images
                        in group chats.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="leave-group">
                    <AccordionTrigger>How do I leave a group?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        To leave a group, navigate to the group page and click
                        on the options menu (three dots), then select "Leave
                        Group". If you're the group owner, you'll need to
                        transfer ownership to another member before leaving, or
                        you can choose to delete the group entirely.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Questions */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account & Settings
                </CardTitle>
                <CardDescription>
                  Questions about your account and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="create-account">
                    <AccordionTrigger>
                      How do I create an account?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        You can create an account by clicking "Sign Up" on the
                        homepage or login page. You can register using your
                        email address and password, or use single sign-on
                        options like Google or GitHub. Verify your email address
                        to activate your account.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="change-password">
                    <AccordionTrigger>
                      How do I change my password?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        To change your password, go to your Account Settings
                        page, navigate to the Security tab, and click "Change
                        Password". You'll need to enter your current password
                        and then your new password twice to confirm. If you've
                        forgotten your password, use the "Forgot Password" link
                        on the login page.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="delete-account">
                    <AccordionTrigger>
                      Can I delete my account?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Yes, you can delete your account at any time. Go to
                        Account Settings, scroll to the bottom, and click
                        "Delete Account". This will permanently remove your
                        account and all associated data. This action cannot be
                        undone, so please be certain before proceeding.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="notifications">
                    <AccordionTrigger>
                      How do I manage notifications?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        You can manage your notification preferences in the
                        Account Settings under the Notifications tab. Here you
                        can choose which events trigger notifications (new
                        messages, group invites, etc.) and how you receive them
                        (email, in-app, or both).
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact */}
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <ShieldCheck className="text-primary h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Still have questions?</h3>
                <p className="text-muted-foreground text-sm">
                  Our support team is here to help
                </p>
              </div>
            </div>
            <a
              href="mailto:support@huddle.example.com"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Contact Support
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
