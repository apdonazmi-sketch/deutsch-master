import { pgTable, serial, integer, varchar, text, timestamp, real, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  username: varchar("username", { length: 60 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  token: varchar("token", { length: 80 }).primaryKey(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  goal: varchar("goal", { length: 60 }).notNull(),
  customGoal: text("custom_goal"),
  currentLevel: varchar("current_level", { length: 6 }).notNull(),
  targetLevel: varchar("target_level", { length: 6 }).notNull(),
  months: integer("months").notNull(),
  dailyMinutes: integer("daily_minutes").notNull(),
  styles: text("styles").notNull(), // JSON array
  topics: text("topics").notNull(), // JSON array
  fears: text("fears").notNull(), // JSON array
  dialect: varchar("dialect", { length: 12 }).notNull().default("egyptian"),
  transition: varchar("transition", { length: 12 }).notNull().default("gradual"),
  report: text("report"), // JSON of generated report
  weekFocus: text("week_focus"), // JSON: skill weights for current week
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userVocab = pgTable(
  "user_vocab",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    vocabId: varchar("vocab_id", { length: 40 }).notNull(),
    ease: real("ease").notNull().default(2.5),
    intervalDays: real("interval_days").notNull().default(0),
    reps: integer("reps").notNull().default(0),
    lapses: integer("lapses").notNull().default(0),
    nextReview: timestamp("next_review").defaultNow().notNull(),
    lastQuality: integer("last_quality").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [unique("uv_user_vocab").on(t.userId, t.vocabId)]
);

export const activity = pgTable("activity", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  kind: varchar("kind", { length: 24 }).notNull(),
  value: integer("value").notNull().default(1),
  meta: text("meta"),
  day: varchar("day", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const skillScores = pgTable("skill_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  listening: integer("listening").notNull().default(0),
  speaking: integer("speaking").notNull().default(0),
  grammar: integer("grammar").notNull().default(0),
  reading: integer("reading").notNull().default(0),
  writing: integer("writing").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mode: varchar("mode", { length: 16 }).notNull().default("free"),
  scenario: varchar("scenario", { length: 40 }),
  meta: text("meta"), // JSON: scenario step, mistakes
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  role: varchar("role", { length: 10 }).notNull(),
  german: text("german"),
  arabic: text("arabic"),
  correction: text("correction"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  level: varchar("level", { length: 6 }).notNull(),
  skill: varchar("skill", { length: 16 }).notNull(),
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const taskCompletions = pgTable(
  "task_completions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    day: varchar("day", { length: 10 }).notNull(),
    task: varchar("task", { length: 24 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [unique("tc_user_day_task").on(t.userId, t.day, t.task)]
);

export const weeklyReports = pgTable("weekly_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  weekStart: varchar("week_start", { length: 10 }).notNull(),
  report: text("report").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
