import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, employees, sales, goals, tasks, meetings, companies, InsertCompany, Company, timeRecords } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "avatar", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ORIZON specific queries
export async function getEmployeesByCompany(companyId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(employees).where(eq(employees.companyId, companyId));
}

export async function getSalesByCompany(companyId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sales).where(eq(sales.companyId, companyId));
}

export async function getGoalsByEmployee(employeeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(goals).where(eq(goals.employeeId, employeeId));
}

export async function getTasksByCompany(companyId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tasks).where(eq(tasks.companyId, companyId));
}

export async function getMeetingsByCompany(companyId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(meetings).where(eq(meetings.companyId, companyId));
}


// COMPANY MANAGEMENT
export async function createCompany(data: InsertCompany): Promise<Company | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create company: database not available");
    return null;
  }

  try {
    const result = await db.insert(companies).values(data);
    const companyId = (result as any)[0];
    
    if (companyId) {
      const created = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1);
      return created.length > 0 ? created[0] : null;
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to create company:", error);
    throw error;
  }
}

export async function getCompaniesByOwner(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(companies).where(eq(companies.ownerId, ownerId));
}

export async function getCompanyById(companyId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1);
  return result.length > 0 ? result[0] : null;
}


export async function updateUserCompany(userId: number, companyId: number) {
  const db = await getDb();
  if (!db) return null;
  
  try {
    await db.update(users).set({ companyId }).where(eq(users.id, userId));
    const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update user company:", error);
    throw error;
  }
}


// EMPLOYEES - Queries completas
export async function getEmployeeById(employeeId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(employees).where(eq(employees.id, employeeId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createEmployee(data: any) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.insert(employees).values(data);
    const employeeId = (result as any)[0];
    if (employeeId) {
      return getEmployeeById(employeeId);
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to create employee:", error);
    throw error;
  }
}

// SALES - Queries completas
export async function getSaleById(saleId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(sales).where(eq(sales.id, saleId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createSale(data: any) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.insert(sales).values(data);
    const saleId = (result as any)[0];
    if (saleId) {
      return getSaleById(saleId);
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to create sale:", error);
    throw error;
  }
}

// GOALS - Queries completas
export async function getGoalById(goalId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(goals).where(eq(goals.id, goalId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createGoal(data: any) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.insert(goals).values(data);
    const goalId = (result as any)[0];
    if (goalId) {
      return getGoalById(goalId);
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to create goal:", error);
    throw error;
  }
}

// TASKS - Queries completas
export async function getTaskById(taskId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createTask(data: any) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.insert(tasks).values(data);
    const taskId = (result as any)[0];
    if (taskId) {
      return getTaskById(taskId);
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to create task:", error);
    throw error;
  }
}

// TIME RECORDS - Queries completas
export async function getTimeRecordsByEmployee(employeeId: number, companyId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(timeRecords).where(
    eq(timeRecords.employeeId, employeeId) && eq(timeRecords.companyId, companyId)
  );
}

export async function createTimeRecord(data: any) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.insert(timeRecords).values(data);
    const recordId = (result as any)[0];
    if (recordId) {
      const record = await db.select().from(timeRecords).where(eq(timeRecords.id, recordId)).limit(1);
      return record.length > 0 ? record[0] : null;
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to create time record:", error);
    throw error;
  }
}
