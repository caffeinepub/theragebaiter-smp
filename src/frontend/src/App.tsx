import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type React from "react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormData = Record<string, string>;
type Page = "landing" | "apply";

// ─── Discord Webhook ───────────────────────────────────────────────────────────

const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1480303611639758870/6I7NAtgAiz6WKunYXk48KJ1p8g_49UEBbjB0v0kncR3G0zbttkJRdgTylUmZW1v-fXI5";

async function sendToDiscord(
  formData: FormData,
  questions: { id: string; number: number; label: string }[],
): Promise<void> {
  const sections = [
    { title: "📋 Personal Info (Q1–10)", range: [1, 10] },
    { title: "⚔️ Gameplay Style (Q11–20)", range: [11, 20] },
    { title: "👥 Community & Rules (Q21–30)", range: [21, 30] },
    { title: "🔥 Ragebait & Chaos (Q31–40)", range: [31, 40] },
  ];

  const embeds = sections.map((section) => {
    const sectionQs = questions.filter(
      (q) => q.number >= section.range[0] && q.number <= section.range[1],
    );
    const fields = sectionQs.map((q) => ({
      name: `Q${q.number}: ${q.label}`,
      value: formData[q.id]?.trim() || "_No answer provided_",
      inline: false,
    }));
    return {
      title: section.title,
      color: 0xf5c518,
      fields,
    };
  });

  const username = formData.q1?.trim() || "Unknown Applicant";

  await fetch(DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "TheRagebaiter SMP",
      content: `**New Application from ${username}** 🎮`,
      embeds: embeds.slice(0, 4),
    }),
  });
}

// ─── Form Questions Definition ────────────────────────────────────────────────

type QuestionType = "input" | "textarea" | "select";

interface Question {
  id: string;
  number: number;
  label: string;
  type: QuestionType;
  placeholder?: string;
  options?: string[];
}

const personalInfoQuestions: Question[] = [
  {
    id: "q1",
    number: 1,
    label: "What is your Minecraft username?",
    type: "input",
    placeholder: "e.g. xX_NotoriousPVP_Xx",
  },
  {
    id: "q2",
    number: 2,
    label: "How old are you?",
    type: "select",
    options: ["Under 16", "16–18", "18–21", "21–25", "25+"],
  },
  {
    id: "q3",
    number: 3,
    label: "What timezone are you in?",
    type: "input",
    placeholder: "e.g. EST, PST, GMT+2",
  },
  {
    id: "q4",
    number: 4,
    label: "How long have you been playing Minecraft?",
    type: "select",
    options: ["<1 year", "1–3 years", "3–5 years", "5+ years"],
  },
  {
    id: "q5",
    number: 5,
    label: "How many hours per week do you play?",
    type: "select",
    options: ["<5", "5–10", "10–20", "20+"],
  },
  {
    id: "q6",
    number: 6,
    label: "What platform do you play on?",
    type: "select",
    options: ["Java", "Bedrock", "Both"],
  },
  {
    id: "q7",
    number: 7,
    label: "Do you have a Discord account?",
    type: "select",
    options: ["Yes", "No"],
  },
  {
    id: "q8",
    number: 8,
    label: "What is your Discord username?",
    type: "input",
    placeholder: "e.g. user#1234 or user",
  },
  {
    id: "q9",
    number: 9,
    label: "How did you hear about TheRagebaiter SMP?",
    type: "select",
    options: ["Friend", "Social Media", "YouTube/Twitch", "Other"],
  },
  {
    id: "q10",
    number: 10,
    label: "Have you played on any other SMPs?",
    type: "textarea",
    placeholder:
      "Name any previous SMPs you've been part of and your experience...",
  },
];

const gameplayQuestions: Question[] = [
  {
    id: "q11",
    number: 11,
    label: "What is your primary role on an SMP?",
    type: "select",
    options: [
      "Builder",
      "PvP Fighter",
      "Farmer/Grinder",
      "Explorer",
      "Strategist",
      "Other",
    ],
  },
  {
    id: "q12",
    number: 12,
    label: "How would you rate your PvP skill? (1 = Noob, 10 = Goated)",
    type: "select",
    options: [
      "1 – Absolute Noob",
      "2",
      "3",
      "4",
      "5 – Decent",
      "6",
      "7",
      "8",
      "9",
      "10 – Unmatched",
    ],
  },
  {
    id: "q13",
    number: 13,
    label: "Do you prefer solo play or group alliances?",
    type: "select",
    options: ["Solo", "Alliances", "Both"],
  },
  {
    id: "q14",
    number: 14,
    label: "Describe your base-building style.",
    type: "textarea",
    placeholder:
      "Hidden underground bunker? Floating sky fortress? Mega base? Tell us your style...",
  },
  {
    id: "q15",
    number: 15,
    label: "Are you a content creator?",
    type: "select",
    options: ["Yes – active", "Yes – casual", "No"],
  },
  {
    id: "q16",
    number: 16,
    label: "What is your most impressive Minecraft achievement?",
    type: "textarea",
    placeholder:
      "Speed runs, massive builds, legendary PvP moments — don't be modest.",
  },
  {
    id: "q17",
    number: 17,
    label: "Do you grief or prefer no-griefing servers?",
    type: "select",
    options: ["I grief", "I prefer no-griefing", "Depends on rules"],
  },
  {
    id: "q18",
    number: 18,
    label: "How active do you plan to be on the server?",
    type: "select",
    options: ["Daily", "A few times a week", "Weekends only"],
  },
  {
    id: "q19",
    number: 19,
    label: "What mods or resource packs do you use?",
    type: "input",
    placeholder: "e.g. Optifine, Sodium, Faithful x32...",
  },
  {
    id: "q20",
    number: 20,
    label: "Describe your playstyle in three words.",
    type: "input",
    placeholder: "e.g. Ruthless, strategic, unpredictable",
  },
];

const communityQuestions: Question[] = [
  {
    id: "q21",
    number: 21,
    label: "Have you read the server rules?",
    type: "select",
    options: ["Yes", "No – but I will"],
  },
  {
    id: "q22",
    number: 22,
    label: "Have you ever been banned from a server?",
    type: "select",
    options: ["Yes", "No"],
  },
  {
    id: "q23",
    number: 23,
    label: "If yes, explain why.",
    type: "textarea",
    placeholder: "Be honest. We value transparency over perfection.",
  },
  {
    id: "q24",
    number: 24,
    label: "How do you handle conflict with other players?",
    type: "textarea",
    placeholder: "Describe a time you dealt with in-game drama or conflict...",
  },
  {
    id: "q25",
    number: 25,
    label: "What does 'fair play' mean to you?",
    type: "textarea",
    placeholder:
      "Define fairness in your own words in the context of a competitive SMP...",
  },
  {
    id: "q26",
    number: 26,
    label: "Are you willing to follow admin decisions even if you disagree?",
    type: "select",
    options: ["Yes", "No", "Depends"],
  },
  {
    id: "q27",
    number: 27,
    label: "How do you contribute positively to a community?",
    type: "textarea",
    placeholder:
      "Events you've organized, help you've given, ways you've made servers better...",
  },
  {
    id: "q28",
    number: 28,
    label: "What would you do if you found a game-breaking exploit?",
    type: "select",
    options: ["Report it", "Use it", "Depends"],
  },
  {
    id: "q29",
    number: 29,
    label: "Do you understand this is a high-drama, ragebait server?",
    type: "select",
    options: ["Yes and I love it", "Yes and I can handle it", "Not sure"],
  },
  {
    id: "q30",
    number: 30,
    label: "What is your biggest pet peeve in multiplayer games?",
    type: "textarea",
    placeholder: "What makes you rage? What tilts you the most in-game?",
  },
];

const rageBaitQuestions: Question[] = [
  {
    id: "q31",
    number: 31,
    label:
      "Someone steals all your diamonds while you're offline. What do you do?",
    type: "textarea",
    placeholder: "Walk us through your exact revenge plan, step by step...",
  },
  {
    id: "q32",
    number: 32,
    label:
      "You witness a major betrayal in your alliance. Do you stay loyal or flip?",
    type: "select",
    options: ["Stay loyal", "Flip", "Play both sides"],
  },
  {
    id: "q33",
    number: 33,
    label:
      "You are offered OP loot to betray your best friend on the server. Do you take it?",
    type: "select",
    options: ["Yes", "No", "Negotiate for more"],
  },
  {
    id: "q34",
    number: 34,
    label: "How do you respond when someone trash-talks you in chat?",
    type: "textarea",
    placeholder:
      "Show us your comeback game. Or do you let actions speak louder?",
  },
  {
    id: "q35",
    number: 35,
    label:
      "A new player asks for help but you suspect they're scouting your base. What do you do?",
    type: "textarea",
    placeholder: "Trust or trap? What's your move?",
  },
  {
    id: "q36",
    number: 36,
    label: "You're losing a PvP fight badly. What's your escape plan?",
    type: "textarea",
    placeholder:
      "Pearl clutch? Log off? Run and fight another day? Give us the details.",
  },
  {
    id: "q37",
    number: 37,
    label: "The server is in full chaos — everyone is at war. Pick your role.",
    type: "select",
    options: ["Instigator", "Peacemaker", "Opportunist", "Observer"],
  },
  {
    id: "q38",
    number: 38,
    label: "Describe your ideal chaotic server moment.",
    type: "textarea",
    placeholder:
      "Paint the picture. What's the most epic chaos scenario you can imagine?",
  },
  {
    id: "q39",
    number: 39,
    label: "What is your personal ragebait move?",
    type: "textarea",
    placeholder:
      "The thing you do that drives other players absolutely insane...",
  },
  {
    id: "q40",
    number: 40,
    label: "FINAL BOSS: Why should we accept YOU over everyone else?",
    type: "textarea",
    placeholder:
      "This is your moment. Your closing argument. Make it unforgettable. No pressure.",
  },
];

// ─── Rules Data ────────────────────────────────────────────────────────────────

const rulesData = {
  general: [
    "Treat all players with basic respect — trash talk is fine, harassment is not.",
    "No hacking, cheating, or using unauthorized clients that give unfair advantages.",
    "No doxxing, sharing real personal information about any player without consent.",
    "Keep slurs and genuinely hateful language out of chat — edgy is fine, hateful is not.",
    "No impersonating admins or other players to mislead the community.",
    "Admins reserve the right to remove anyone who threatens the health of the server.",
  ],
  pvp: [
    "PvP is enabled everywhere — if you're out in the open, you're fair game.",
    "No combat logging. If you disconnect mid-fight intentionally, you will be penalized.",
    "No exploiting bugs or glitches to gain an unfair advantage in fights.",
    "Camping spawn points for extended periods is against the spirit of the server.",
    "Duels can be called — if both parties agree, admins will oversee fair terms.",
  ],
  building: [
    "Do not build within 100 blocks of another player's established base without their explicit consent.",
    "Lag machines are strictly prohibited and will result in an immediate ban.",
    "Do not build structures designed solely to grief the visual aesthetic of other players.",
    "Redstone contraptions that cause server-wide lag are subject to admin removal.",
    "Claim your land with markers — unclaimed land is fair game for anyone.",
  ],
  community: [
    "Harassment — repeated targeted behavior meant to distress a player — is a bannable offense.",
    "All slurs are banned with zero tolerance, regardless of context.",
    "Report rule violations to admins via Discord, not in public chat.",
    "Do not impersonate other players or admins at any time.",
    "Respect Discord channels and keep conversations in appropriate spaces.",
    "Ban appeals are reviewed within 48 hours — one appeal per ban.",
  ],
  chaos: [
    "Ragebait culture is celebrated here — it's part of what makes this server unique.",
    "Betrayals, backstabs, and political drama are not just allowed — they're encouraged.",
    "In-game drama must stay in-game. Do not carry beef outside the server or to Discord DMs.",
    "Admins have absolute final say on all disputes, bans, and rule interpretations.",
    "If you can't handle being ragebaited, this server is not for you.",
    "The goal is chaos with community. Push limits — but never break the server.",
  ],
};

// ─── Sub-Components ────────────────────────────────────────────────────────────

function QuestionField({
  question,
  value,
  onChange,
}: { question: Question; value: string; onChange: (v: string) => void }) {
  const labelEl = (
    <div className="flex items-start gap-3 mb-4">
      {/* Yellow Q-number badge */}
      <span
        className="shrink-0 inline-flex items-center justify-center rounded-md text-xs font-black px-2 py-1 leading-none mt-0.5"
        style={{
          background: "oklch(0.87 0.19 95 / 0.18)",
          color: "oklch(0.87 0.19 95)",
          border: "1px solid oklch(0.87 0.19 95 / 0.45)",
          minWidth: "2.25rem",
        }}
      >
        Q{question.number}
      </span>
      <Label
        className="text-base font-semibold leading-snug"
        style={{ color: "oklch(0.97 0.01 290)" }}
      >
        {question.label}
      </Label>
    </div>
  );

  const cardStyle: React.CSSProperties = {
    background: "oklch(0.20 0.08 290)",
    border: "1px solid oklch(0.87 0.19 95 / 0.18)",
    borderLeft: "3px solid oklch(0.87 0.19 95 / 0.7)",
    borderRadius: "0.625rem",
    padding: "1.125rem 1.25rem",
  };

  if (question.type === "textarea") {
    return (
      <div style={cardStyle}>
        {labelEl}
        <Textarea
          data-ocid="form.textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          rows={3}
          className="resize-none text-sm transition-all duration-200"
          style={{
            background: "oklch(0.14 0.06 290)",
            border: "1px solid oklch(0.87 0.19 95 / 0.22)",
            color: "oklch(0.97 0.01 290)",
          }}
        />
      </div>
    );
  }

  if (question.type === "select") {
    return (
      <div style={cardStyle}>
        {labelEl}
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger
            data-ocid="form.select"
            className="text-sm transition-all duration-200"
            style={{
              background: "oklch(0.14 0.06 290)",
              border: "1px solid oklch(0.87 0.19 95 / 0.22)",
              color: "oklch(0.97 0.01 290)",
            }}
          >
            <SelectValue placeholder="Select an option..." />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {question.options?.map((opt) => (
              <SelectItem
                key={opt}
                value={opt}
                className="text-sm focus:bg-primary/20 focus:text-primary"
              >
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      {labelEl}
      <Input
        data-ocid="form.input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        className="text-sm transition-all duration-200"
        style={{
          background: "oklch(0.14 0.06 290)",
          border: "1px solid oklch(0.87 0.19 95 / 0.22)",
          color: "oklch(0.97 0.01 290)",
        }}
      />
    </div>
  );
}

// ─── Apply Page ────────────────────────────────────────────────────────────────

function ApplyPage({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState<FormData>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateField = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const allFormQuestions = [
    ...personalInfoQuestions,
    ...gameplayQuestions,
    ...communityQuestions,
    ...rageBaitQuestions,
  ];

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await sendToDiscord(formData, allFormQuestions);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError(
        "Failed to send your application. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    onBack();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* ─── Apply Navbar ──────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            data-ocid="apply.link"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 9H3M9 3L3 9l6 6" />
            </svg>
            Back to Home
          </button>

          <span className="text-lg font-black text-primary tracking-tight text-glow-yellow">
            TheRagebaiter SMP
          </span>

          <div className="w-28" />
        </div>
      </nav>

      {/* ─── Application Form ─────────────────────────────────────────────── */}
      <main
        className="py-14 sm:py-20 px-4 sm:px-6 relative"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, oklch(0.20 0.09 285 / 0.5) 0%, transparent 70%)",
        }}
      >
        {/* Left edge accent */}
        <div
          className="absolute left-0 top-16 bottom-16 w-1 hidden lg:block"
          style={{
            background:
              "linear-gradient(to bottom, transparent, oklch(0.87 0.19 95 / 0.4), transparent)",
          }}
        />
        <div className="max-w-3xl mx-auto">
          {/* Page header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              40 Questions — Survival Edition
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
              Submit Your{" "}
              <span className="text-primary text-glow-yellow">Application</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              40 questions. No shortcuts. Prove your worth — or go back to
              creative mode.
            </p>
          </div>

          {submitted ? (
            <Card
              data-ocid="form.success_state"
              className="border-primary/50 bg-card text-center p-8 sm:p-12 glow-yellow"
            >
              <div className="text-5xl sm:text-6xl mb-6">🎮</div>
              <h3 className="text-2xl sm:text-3xl font-black text-primary mb-4 text-glow-yellow">
                Application Submitted!
              </h3>
              <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed mb-6">
                We'll review it and reach out via Discord. In the meantime,
                don't reveal your application to other applicants — that's
                already ragebait territory.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold mb-8">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Applications reviewed within 48–72 hours
              </div>
              <div className="pt-4">
                <Button
                  onClick={handleBack}
                  data-ocid="form.secondary_button"
                  variant="outline"
                  className="border-border text-muted-foreground hover:text-primary hover:border-primary/50"
                >
                  ← Back to Home
                </Button>
              </div>
            </Card>
          ) : (
            <div
              className="rounded-xl overflow-hidden"
              style={{
                boxShadow:
                  "0 0 0 1px oklch(0.87 0.19 95 / 0.25), 0 0 40px oklch(0.87 0.19 95 / 0.08), 0 8px 32px oklch(0.13 0.06 290 / 0.6)",
                background: "oklch(0.17 0.07 290)",
              }}
            >
              <div className="p-5 sm:p-8 space-y-10">
                {/* ── Section 1: Personal Info ── */}
                <div data-ocid="form.section.1">
                  <div className="flex items-center gap-3 mb-6">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg text-sm font-black shrink-0"
                      style={{
                        background: "oklch(0.87 0.19 95 / 0.15)",
                        color: "oklch(0.87 0.19 95)",
                        border: "1px solid oklch(0.87 0.19 95 / 0.35)",
                      }}
                    >
                      01
                    </span>
                    <div>
                      <h2 className="text-lg font-black text-foreground tracking-tight">
                        Personal Info
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Questions 1–10
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {personalInfoQuestions.map((q) => (
                      <QuestionField
                        key={q.id}
                        question={q}
                        value={formData[q.id] ?? ""}
                        onChange={(v) => updateField(q.id, v)}
                      />
                    ))}
                  </div>
                </div>

                <Separator
                  className="opacity-30"
                  style={{ borderColor: "oklch(0.87 0.19 95 / 0.3)" }}
                />

                {/* ── Section 2: Gameplay Style ── */}
                <div data-ocid="form.section.2">
                  <div className="flex items-center gap-3 mb-6">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg text-sm font-black shrink-0"
                      style={{
                        background: "oklch(0.87 0.19 95 / 0.15)",
                        color: "oklch(0.87 0.19 95)",
                        border: "1px solid oklch(0.87 0.19 95 / 0.35)",
                      }}
                    >
                      02
                    </span>
                    <div>
                      <h2 className="text-lg font-black text-foreground tracking-tight">
                        Gameplay Style
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Questions 11–20
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {gameplayQuestions.map((q) => (
                      <QuestionField
                        key={q.id}
                        question={q}
                        value={formData[q.id] ?? ""}
                        onChange={(v) => updateField(q.id, v)}
                      />
                    ))}
                  </div>
                </div>

                <Separator
                  className="opacity-30"
                  style={{ borderColor: "oklch(0.87 0.19 95 / 0.3)" }}
                />

                {/* ── Section 3: Community & Rules ── */}
                <div data-ocid="form.section.3">
                  <div className="flex items-center gap-3 mb-6">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg text-sm font-black shrink-0"
                      style={{
                        background: "oklch(0.87 0.19 95 / 0.15)",
                        color: "oklch(0.87 0.19 95)",
                        border: "1px solid oklch(0.87 0.19 95 / 0.35)",
                      }}
                    >
                      03
                    </span>
                    <div>
                      <h2 className="text-lg font-black text-foreground tracking-tight">
                        Community &amp; Rules
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Questions 21–30
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {communityQuestions.map((q) => (
                      <QuestionField
                        key={q.id}
                        question={q}
                        value={formData[q.id] ?? ""}
                        onChange={(v) => updateField(q.id, v)}
                      />
                    ))}
                  </div>
                </div>

                <Separator
                  className="opacity-30"
                  style={{ borderColor: "oklch(0.87 0.19 95 / 0.3)" }}
                />

                {/* ── Section 4: Ragebait & Chaos Scenarios ── */}
                <div data-ocid="form.section.4">
                  <div className="flex items-center gap-3 mb-6">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg text-sm font-black shrink-0"
                      style={{
                        background: "oklch(0.87 0.19 95 / 0.15)",
                        color: "oklch(0.87 0.19 95)",
                        border: "1px solid oklch(0.87 0.19 95 / 0.35)",
                      }}
                    >
                      04
                    </span>
                    <div>
                      <h2 className="text-lg font-black text-foreground tracking-tight">
                        Ragebait &amp; Chaos Scenarios
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Questions 31–40
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {rageBaitQuestions.map((q) => (
                      <QuestionField
                        key={q.id}
                        question={q}
                        value={formData[q.id] ?? ""}
                        onChange={(v) => updateField(q.id, v)}
                      />
                    ))}
                  </div>
                </div>

                {/* ── Submit ── */}
                <div className="pt-4 border-t border-border/50 space-y-4">
                  {submitError && (
                    <div
                      data-ocid="form.error_state"
                      className="text-sm font-semibold text-center rounded-lg px-4 py-3"
                      style={{
                        background: "oklch(0.25 0.08 20 / 0.4)",
                        border: "1px solid oklch(0.65 0.2 20 / 0.5)",
                        color: "oklch(0.85 0.1 20)",
                      }}
                    >
                      {submitError}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Button
                      onClick={handleBack}
                      data-ocid="form.secondary_button"
                      variant="outline"
                      disabled={submitting}
                      className="border-border text-muted-foreground hover:text-primary hover:border-primary/50 order-2 sm:order-1"
                    >
                      ← Back to Home
                    </Button>
                    <Button
                      data-ocid="form.submit_button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="bg-primary text-primary-foreground font-black px-10 py-6 text-base glow-yellow hover:bg-accent hover:scale-105 transition-all duration-300 order-1 sm:order-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        "🎮 Submit Application"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/50 bg-card/30 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} TheRagebaiter SMP. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ─── Landing Page ──────────────────────────────────────────────────────────────

function LandingPage({ onApply }: { onApply: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { label: "About", target: "about" },
    { label: "Rules", target: "rules" },
  ];

  const aboutCards = [
    {
      icon: "⛏️",
      title: "Survival Mode",
      desc: "Pure Survival — gather, build, fight, and outlast. The world is unforgiving and so are your fellow players. No creative mode shortcuts.",
    },
    {
      icon: "🔥",
      title: "High-Stakes PvP",
      desc: "Every fight has consequences. Loot matters. Deaths sting. Victory tastes electric.",
    },
    {
      icon: "👥",
      title: "Tight-Knit Community",
      desc: "Small whitelist. Every player is handpicked. You know everyone — and that makes every betrayal personal.",
    },
    {
      icon: "🎭",
      title: "Ragebait Culture",
      desc: "The server runs on chaos. Alliances form and collapse overnight. Drama is content. Chaos is the point.",
    },
  ];

  const handleApply = () => {
    onApply();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* ─── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-lg font-black text-primary tracking-tight hover:text-accent transition-colors duration-200 text-glow-yellow"
          >
            TheRagebaiter SMP
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.target}
                type="button"
                data-ocid="nav.link"
                onClick={() => scrollTo(link.target)}
                className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-primary rounded-md hover:bg-primary/10 transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
            <Button
              data-ocid="nav.primary_button"
              onClick={handleApply}
              className="ml-2 bg-primary text-primary-foreground font-bold text-sm hover:bg-accent glow-yellow-sm transition-all duration-200"
            >
              Apply Now
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-card/95 backdrop-blur-xl px-4 pb-4 pt-2 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.target}
                type="button"
                data-ocid="nav.link"
                onClick={() => scrollTo(link.target)}
                className="w-full text-left px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:text-primary rounded-md hover:bg-primary/10 transition-all"
              >
                {link.label}
              </button>
            ))}
            <Button
              data-ocid="nav.primary_button"
              onClick={handleApply}
              className="w-full mt-2 bg-primary text-primary-foreground font-bold text-sm hover:bg-accent"
            >
              Apply Now
            </Button>
          </div>
        )}
      </nav>

      {/* ─── Hero Section ────────────────────────────────────────────────────── */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 grid-pattern opacity-60" />
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-pulse-glow pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.45 0.18 290 / 0.35) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full animate-pulse-glow-2 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.40 0.20 285 / 0.30) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.87 0.19 95 / 0.04) 0%, transparent 60%)",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-8 animate-float">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Now Accepting Applications
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter mb-6">
            <span className="shimmer-text">TheRagebaiter</span>
            <br />
            <span className="text-foreground">SMP Application</span>
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-muted-foreground mb-4 tracking-wide">
            Only the worthy survive.
          </p>

          <p className="text-sm sm:text-base text-muted-foreground/70 mb-10 max-w-xl mx-auto leading-relaxed">
            40 questions stand between you and a whitelist spot. Think you can
            handle the chaos?
          </p>

          <Button
            data-ocid="hero.primary_button"
            onClick={handleApply}
            size="lg"
            className="bg-primary text-primary-foreground font-black text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-7 rounded-lg glow-yellow hover:bg-accent hover:scale-105 transition-all duration-300 tracking-wide"
          >
            Take the 40 Question Quiz →
          </Button>

          <div className="mt-12 flex items-center justify-center gap-8 text-center">
            {[
              ["40", "Questions"],
              ["∞", "Drama"],
              ["0", "Mercy"],
            ].map(([num, label]) => (
              <div key={label} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-primary text-glow-yellow">
                  {num}
                </div>
                <div className="text-xs text-muted-foreground/70 uppercase tracking-widest font-semibold">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, oklch(0.13 0.06 290))",
          }}
        />
      </section>

      {/* ─── About Section ───────────────────────────────────────────────────── */}
      <section id="about" className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest uppercase text-primary/80 mb-3 block">
              About the Server
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
              What is{" "}
              <span className="text-primary text-glow-yellow">
                TheRagebaiter
              </span>{" "}
              SMP?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
              A Survival mode SMP unlike any other. Hand-picked players, no
              respawn safety net, and a community built on chaos. Only the
              sharpest survive — and only the most chaotic thrive.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {aboutCards.map((card) => (
              <Card
                key={card.title}
                className="bg-card border-border hover:border-primary/40 transition-all duration-300 hover:glow-yellow-sm group overflow-hidden relative"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "radial-gradient(circle at top left, oklch(0.87 0.19 95 / 0.05) 0%, transparent 60%)",
                  }}
                />
                <CardHeader className="pb-3">
                  <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                  <CardTitle className="text-base font-black text-foreground group-hover:text-primary transition-colors duration-200">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Apply CTA within About section */}
          <div className="mt-14 text-center">
            <p className="text-muted-foreground text-sm mb-5">
              Ready to prove you belong here?
            </p>
            <Button
              data-ocid="about.primary_button"
              onClick={handleApply}
              className="bg-primary text-primary-foreground font-black px-10 py-5 text-sm glow-yellow hover:bg-accent hover:scale-105 transition-all duration-300"
            >
              Apply for a Whitelist Spot →
            </Button>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div
        className="h-px mx-auto max-w-6xl px-6"
        style={{
          background:
            "linear-gradient(to right, transparent, oklch(0.87 0.19 95 / 0.3), transparent)",
        }}
      />

      {/* ─── Chapter Break Divider ───────────────────────────────────────────── */}
      <div className="relative py-12 px-4 sm:px-6">
        {/* Thick gradient bar with yellow glow */}
        <div
          className="h-[3px] w-full mb-8"
          style={{
            background:
              "linear-gradient(to right, transparent, oklch(0.87 0.19 95 / 0.7) 20%, oklch(0.92 0.22 100) 50%, oklch(0.87 0.19 95 / 0.7) 80%, transparent)",
            boxShadow:
              "0 0 16px oklch(0.87 0.19 95 / 0.5), 0 0 32px oklch(0.87 0.19 95 / 0.25)",
          }}
        />

        {/* Centered "SERVER RULES" badge with horizontal rules */}
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, oklch(0.87 0.19 95 / 0.35))",
            }}
          />
          <div
            className="px-5 py-1.5 rounded-full border text-xs font-black tracking-[0.25em] uppercase shrink-0"
            style={{
              color: "oklch(0.87 0.19 95)",
              borderColor: "oklch(0.87 0.19 95 / 0.4)",
              background: "oklch(0.87 0.19 95 / 0.08)",
              boxShadow:
                "0 0 12px oklch(0.87 0.19 95 / 0.2), inset 0 0 12px oklch(0.87 0.19 95 / 0.05)",
              textShadow: "0 0 10px oklch(0.87 0.19 95 / 0.5)",
            }}
          >
            Server Rules
          </div>
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(to left, transparent, oklch(0.87 0.19 95 / 0.35))",
            }}
          />
        </div>
      </div>

      {/* ─── Rules Section ───────────────────────────────────────────────────── */}
      <section
        id="rules"
        className="pb-20 sm:pb-28 px-4 sm:px-6 relative"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.15 0.08 288 / 0.6) 0%, oklch(0.13 0.06 290 / 0) 100%)",
        }}
      >
        {/* Right edge accent for the rules zone */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1 hidden lg:block"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.87 0.19 95 / 0.3), oklch(0.87 0.19 95 / 0.15), transparent)",
          }}
        />
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 mb-12">
            {/* Bold left-side accent bar */}
            <div
              className="w-1 rounded-full self-stretch shrink-0 hidden sm:block"
              style={{
                background:
                  "linear-gradient(to bottom, oklch(0.87 0.19 95) 0%, oklch(0.87 0.19 95 / 0.3) 100%)",
                boxShadow: "0 0 8px oklch(0.87 0.19 95 / 0.5)",
              }}
            />
            <div className="flex-1 text-center sm:text-left">
              <span className="text-xs font-bold tracking-widest uppercase text-primary/80 mb-3 block">
                The Law
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
                Server{" "}
                <span className="text-primary text-glow-yellow">Rules</span>
              </h2>
              <p className="text-muted-foreground text-base max-w-md">
                Chaos has limits. Know them. Respect them. Or face the
                consequences.
              </p>
            </div>
          </div>

          <Tabs defaultValue="general">
            <TabsList className="w-full grid grid-cols-3 sm:grid-cols-5 bg-card/50 border border-border rounded-xl h-auto p-1.5 gap-1 mb-8">
              {[
                { value: "general", label: "General" },
                { value: "pvp", label: "PvP" },
                { value: "building", label: "Building" },
                { value: "community", label: "Community" },
                { value: "chaos", label: "Chaos Rules" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  data-ocid="rules.tab"
                  className="py-2 px-2 text-xs sm:text-sm font-semibold text-muted-foreground rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_12px_oklch(0.87_0.19_95_/_0.4)] transition-all duration-200"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {(
              Object.entries(rulesData) as [keyof typeof rulesData, string[]][]
            ).map(([key, rules]) => (
              <TabsContent key={key} value={key} className="m-0">
                <Card
                  className="border-border"
                  style={{
                    background: "oklch(0.28 0.06 288)",
                    boxShadow:
                      "0 0 0 1px oklch(0.87 0.19 95 / 0.2), 0 4px 24px oklch(0.13 0.06 290 / 0.4)",
                  }}
                >
                  <CardContent className="pt-6 pb-4 px-5 sm:px-8">
                    <ol className="space-y-4">
                      {rules.map((rule, ruleIdx) => (
                        <li key={rule} className="flex items-start gap-4 group">
                          <span className="flex-shrink-0 w-7 h-7 rounded-md bg-primary/25 border border-primary/50 flex items-center justify-center text-xs font-black text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 mt-0.5">
                            {ruleIdx + 1}
                          </span>
                          <p className="text-sm sm:text-base text-white leading-relaxed pt-0.5 font-medium">
                            {rule}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/50 bg-card/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="font-black text-primary text-base text-glow-yellow">
              TheRagebaiter SMP
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              © {new Date().getFullYear()} TheRagebaiter SMP. All rights
              reserved.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            {[
              {
                label: "Discord",
                href: "https://discord.gg/jMpCGJDCCP",
                icon: "💬",
              },
              { label: "Twitter/X", href: "#", icon: "𝕏" },
              { label: "YouTube", href: "#", icon: "▶" },
              { label: "TikTok", href: "#", icon: "♪" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-ocid="footer.link"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
              >
                <span className="text-sm">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-border/30 py-3 text-center" />
      </footer>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("landing");

  if (page === "apply") {
    return <ApplyPage onBack={() => setPage("landing")} />;
  }

  return <LandingPage onApply={() => setPage("apply")} />;
}
