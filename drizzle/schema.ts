import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  datetime,
  date,
  index,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

// ============ OAUTH USERS ============

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

// ============ AUTENTICAÇÃO E ADMINISTRAÇÃO ============

export const adminUsers = mysqlTable("adminUsers", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  fullName: text("fullName"),
  isActive: boolean("isActive").default(true),
  lastLogin: datetime("lastLogin"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

// ============ PROFISSIONAIS E ASSINATURAS ============

export const professionals = mysqlTable(
  "professionals",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: varchar("userId", { length: 64 }).default(""),
    fullName: text("fullName").notNull(),
    email: varchar("email", { length: 320 }).notNull().unique(),
    cpf: varchar("cpf", { length: 14 }).notNull().unique(),
    phone: varchar("phone", { length: 20 }).default(""),
    type: mysqlEnum("type", ["personal_trainer", "nutritionist", "both"]).notNull(),
    specialization: text("specialization").default(sql`('')`),
    licenseNumber: varchar("licenseNumber", { length: 100 }).default(""),
    isActive: boolean("isActive").default(true),
    passwordHash: varchar("passwordHash", { length: 255 }).default(""),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  },
  (table) => ({
    emailIdx: index("professionals_email_idx").on(table.email),
    cpfIdx: index("professionals_cpf_idx").on(table.cpf),
  }),
);

export const subscriptionPlans = mysqlTable(
  "subscriptionPlans",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    type: mysqlEnum("type", ["personal_trainer", "nutritionist", "both"]).notNull(),
    monthlyPrice: decimal("monthlyPrice", { precision: 10, scale: 2 }),
    features: text("features"),
    isActive: boolean("isActive").default(true),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  () => ({}),
);

export const professionalSubscriptions = mysqlTable(
  "professionalSubscriptions",
  {
    id: int("id").autoincrement().primaryKey(),
    professionalId: int("professionalId").notNull(),
    planId: int("planId").notNull(),
    startDate: datetime("startDate").notNull(),
    renewalDate: datetime("renewalDate").notNull(),
    status: mysqlEnum("status", ["active", "inactive", "cancelled", "expired"]).default("active"),
    paymentMethod: varchar("paymentMethod", { length: 50 }),
    lastPaymentDate: datetime("lastPaymentDate"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  },
  (table) => ({
    professionalFk: foreignKey({
      columns: [table.professionalId],
      foreignColumns: [professionals.id],
      name: "professionalSubscriptions_professionalId_professionals_id_fk",
    }).onDelete("cascade"),
    planFk: foreignKey({
      columns: [table.planId],
      foreignColumns: [subscriptionPlans.id],
      name: "professionalSubscriptions_planId_subscriptionPlans_id_fk",
    }).onDelete("restrict"),
  }),
);

export const payments = mysqlTable(
  "payments",
  {
    id: int("id").autoincrement().primaryKey(),
    subscriptionId: int("subscriptionId").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }),
    paymentDate: datetime("paymentDate").notNull(),
    status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending"),
    paymentMethod: varchar("paymentMethod", { length: 50 }),
    transactionId: varchar("transactionId", { length: 255 }),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    subscriptionFk: foreignKey({
      columns: [table.subscriptionId],
      foreignColumns: [professionalSubscriptions.id],
      name: "payments_subscriptionId_professionalSubscriptions_id_fk",
    }).onDelete("cascade"),
  }),
);

// ============ ALUNOS ============

export const students = mysqlTable(
  "students",
  {
    id: int("id").autoincrement().primaryKey(),
    professionalId: int("professionalId").notNull(),
    fullName: text("fullName").notNull(),
    cpf: varchar("cpf", { length: 14 }).notNull().unique(),
    email: varchar("email", { length: 320 }),
    phone: varchar("phone", { length: 20 }).default(""),
    birthDate: date("birthDate"),
    gender: mysqlEnum("gender", ["male", "female", "other"]),
    objective: text("objective"),
    notes: text("notes"),
    isActive: boolean("isActive").default(true),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  },
  (table) => ({
    professionalFk: foreignKey({
      columns: [table.professionalId],
      foreignColumns: [professionals.id],
      name: "students_professionalId_professionals_id_fk",
    }).onDelete("cascade"),
  }),
);

// ============ AVALIAÇÃO FÍSICA ============

export const physicalEvaluations = mysqlTable(
  "physicalEvaluations",
  {
    id: int("id").autoincrement().primaryKey(),
    studentId: int("studentId").notNull(),
    evaluationDate: datetime("evaluationDate").notNull(),
    weight: decimal("weight", { precision: 6, scale: 2 }),
    height: decimal("height", { precision: 5, scale: 2 }),
    imc: decimal("imc", { precision: 5, scale: 2 }),
    bodyFatPercentage: decimal("bodyFatPercentage", { precision: 5, scale: 2 }),
    leanMass: decimal("leanMass", { precision: 6, scale: 2 }),
    fatMass: decimal("fatMass", { precision: 6, scale: 2 }),
    postureNotes: text("postureNotes"),
    observations: text("observations"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    studentFk: foreignKey({
      columns: [table.studentId],
      foreignColumns: [students.id],
      name: "physicalEvaluations_studentId_students_id_fk",
    }).onDelete("cascade"),
  }),
);

// ============ TREINOS E EXERCÍCIOS ============

export const exercises = mysqlTable("exercises", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  videoUrl: text("videoUrl"),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const workouts = mysqlTable(
  "workouts",
  {
    id: int("id").autoincrement().primaryKey(),
    studentId: int("studentId").notNull(),
    professionalId: int("professionalId").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    type: mysqlEnum("type", ["hypertrophy", "strength", "resistance", "weight_loss"]).notNull(),
    notes: text("notes"),
    isActive: boolean("isActive").default(true),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  },
  (table) => ({
    studentFk: foreignKey({
      columns: [table.studentId],
      foreignColumns: [students.id],
      name: "workouts_studentId_students_id_fk",
    }).onDelete("cascade"),
    professionalFk: foreignKey({
      columns: [table.professionalId],
      foreignColumns: [professionals.id],
      name: "workouts_professionalId_professionals_id_fk",
    }).onDelete("cascade"),
  }),
);

export const workoutExercises = mysqlTable(
  "workoutExercises",
  {
    id: int("id").autoincrement().primaryKey(),
    workoutId: int("workoutId").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    sets: varchar("sets", { length: 50 }).notNull(),
    reps: varchar("reps", { length: 50 }).notNull(),
    equipment: varchar("equipment", { length: 100 }),
    order: int("order").default(0),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    workoutFk: foreignKey({
      columns: [table.workoutId],
      foreignColumns: [workouts.id],
      name: "workoutExercises_workoutId_workouts_id_fk",
    }).onDelete("cascade"),
  }),
);

// ============ NUTRIÇÃO E DIETAS ============

export const foods = mysqlTable("foods", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  baseAmount: decimal("baseAmount", { precision: 8, scale: 2 }),
  unit: varchar("unit", { length: 20 }).default("g"),
  calories: decimal("calories", { precision: 8, scale: 2 }),
  protein: decimal("protein", { precision: 8, scale: 2 }),
  carbs: decimal("carbs", { precision: 8, scale: 2 }),
  fats: decimal("fats", { precision: 8, scale: 2 }),
  fiber: decimal("fiber", { precision: 8, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const diets = mysqlTable(
  "diets",
  {
    id: int("id").autoincrement().primaryKey(),
    studentId: int("studentId").notNull(),
    professionalId: int("professionalId").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    type: mysqlEnum("type", ["weight_loss", "hypertrophy", "maintenance", "therapeutic"]).notNull(),
    notes: text("notes"),
    isActive: boolean("isActive").default(true),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  },
  (table) => ({
    studentFk: foreignKey({
      columns: [table.studentId],
      foreignColumns: [students.id],
      name: "diets_studentId_students_id_fk",
    }).onDelete("cascade"),
    professionalFk: foreignKey({
      columns: [table.professionalId],
      foreignColumns: [professionals.id],
      name: "diets_professionalId_professionals_id_fk",
    }).onDelete("cascade"),
  }),
);

export const meals = mysqlTable(
  "meals",
  {
    id: int("id").autoincrement().primaryKey(),
    dietId: int("dietId").notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    time: varchar("time", { length: 5 }),
    order: int("order").default(0),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    dietFk: foreignKey({
      columns: [table.dietId],
      foreignColumns: [diets.id],
      name: "meals_dietId_diets_id_fk",
    }).onDelete("cascade"),
  }),
);

// ============ RECEITAS ============

export const recipes = mysqlTable("recipes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  instructions: text("instructions"),
  prepTime: int("prepTime"),
  servings: int("servings"),
  calories: decimal("calories", { precision: 8, scale: 2 }),
  protein: decimal("protein", { precision: 8, scale: 2 }),
  carbs: decimal("carbs", { precision: 8, scale: 2 }),
  fats: decimal("fats", { precision: 8, scale: 2 }),
  imageUrl: text("imageUrl"),
  isPublic: boolean("isPublic").default(true),
  createdAt: timestamp("createdAt").defaultNow(),
});

// ============ INSIGHTS E ALERTAS (IA) ============

export const insights = mysqlTable(
  "insights",
  {
    id: int("id").autoincrement().primaryKey(),
    professionalId: int("professionalId").notNull(),
    studentId: int("studentId").notNull(),
    type: mysqlEnum("type", ["retention", "performance", "nutrition", "health"]).notNull(),
    priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium"),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    suggestedAction: text("suggestedAction"),
    isResolved: boolean("isResolved").default(false),
    resolvedAt: datetime("resolvedAt"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    professionalFk: foreignKey({
      columns: [table.professionalId],
      foreignColumns: [professionals.id],
      name: "insights_professionalId_professionals_id_fk",
    }).onDelete("cascade"),
    studentFk: foreignKey({
      columns: [table.studentId],
      foreignColumns: [students.id],
      name: "insights_studentId_students_id_fk",
    }).onDelete("cascade"),
  }),
);

export type Professional = typeof professionals.$inferSelect;
export type Student = typeof students.$inferSelect;
export type Workout = typeof workouts.$inferSelect;
export type Diet = typeof diets.$inferSelect;
export type Insight = typeof insights.$inferSelect;