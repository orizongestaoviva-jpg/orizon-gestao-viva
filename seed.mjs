/**
 * Script de seed para popular banco de dados com dados de teste
 * Execução: node seed.mjs
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./drizzle/schema.ts";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL não configurada");
  process.exit(1);
}

async function seed() {
  console.log("🌱 Iniciando seed de dados...");

  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  try {
    // 1. Criar empresa teste
    console.log("📦 Criando empresa teste...");
    const companyResult = await db.insert(schema.companies).values({
      name: "Tech Solutions Brasil",
      cnpj: "12.345.678/0001-90",
      description: "Empresa de tecnologia para testes",
      ownerId: 1,
      plan: "professional",
      status: "active",
    });

    const companyId = companyResult[0];
    console.log(`✅ Empresa criada: ID ${companyId}`);

    // 2. Criar departamentos
    console.log("🏢 Criando departamentos...");
    const departments = await db.insert(schema.departments).values([
      {
        companyId,
        name: "Vendas",
        description: "Departamento de Vendas",
      },
      {
        companyId,
        name: "Desenvolvimento",
        description: "Departamento de Desenvolvimento",
      },
      {
        companyId,
        name: "RH",
        description: "Departamento de Recursos Humanos",
      },
    ]);
    console.log(`✅ ${departments[0]} departamentos criados`);

    // 3. Criar colaboradores
    console.log("👥 Criando colaboradores...");
    const employees = await db.insert(schema.employees).values([
      {
        companyId,
        name: "João Silva",
        email: "joao@empresa.com",
        cpf: "123.456.789-00",
        phone: "(11) 98765-4321",
        position: "Gerente de Vendas",
        departmentId: 1,
        salary: "8000.00",
        hireDate: new Date("2022-01-15"),
        status: "active",
      },
      {
        companyId,
        name: "Maria Santos",
        email: "maria@empresa.com",
        cpf: "987.654.321-00",
        phone: "(11) 98765-4322",
        position: "Desenvolvedora Senior",
        departmentId: 2,
        salary: "10000.00",
        hireDate: new Date("2021-06-01"),
        status: "active",
      },
      {
        companyId,
        name: "Pedro Costa",
        email: "pedro@empresa.com",
        cpf: "456.789.123-00",
        phone: "(11) 98765-4323",
        position: "Vendedor",
        departmentId: 1,
        managerId: 1,
        salary: "5000.00",
        hireDate: new Date("2023-01-10"),
        status: "active",
      },
      {
        companyId,
        name: "Ana Oliveira",
        email: "ana@empresa.com",
        cpf: "789.123.456-00",
        phone: "(11) 98765-4324",
        position: "Desenvolvedora Junior",
        departmentId: 2,
        managerId: 2,
        salary: "6000.00",
        hireDate: new Date("2023-06-15"),
        status: "active",
      },
    ]);
    console.log(`✅ ${employees[0]} colaboradores criados`);

    // 4. Criar vendas
    console.log("💰 Criando vendas...");
    const sales = await db.insert(schema.sales).values([
      {
        companyId,
        salesPersonId: 3, // Pedro
        clientName: "Empresa A",
        value: "50000.00",
        status: "closed_won",
        closingDate: new Date("2024-03-15"),
      },
      {
        companyId,
        salesPersonId: 3, // Pedro
        clientName: "Empresa B",
        value: "75000.00",
        status: "negotiation",
        closingDate: new Date("2024-04-30"),
      },
      {
        companyId,
        salesPersonId: 1, // João
        clientName: "Empresa C",
        value: "120000.00",
        status: "closed_won",
        closingDate: new Date("2024-02-28"),
      },
    ]);
    console.log(`✅ ${sales[0]} vendas criadas`);

    // 5. Criar metas
    console.log("🎯 Criando metas...");
    const goals = await db.insert(schema.goals).values([
      {
        companyId,
        employeeId: 1, // João
        title: "Aumentar vendas em 30%",
        description: "Meta de vendas para Q1 2024",
        targetValue: "500000.00",
        currentValue: "450000.00",
        status: "in_progress",
        dueDate: new Date("2024-03-31"),
      },
      {
        companyId,
        employeeId: 2, // Maria
        title: "Completar projeto X",
        description: "Desenvolvimento do novo módulo",
        targetValue: "100.00",
        currentValue: "75.00",
        status: "in_progress",
        dueDate: new Date("2024-04-30"),
      },
    ]);
    console.log(`✅ ${goals[0]} metas criadas`);

    // 6. Criar tarefas
    console.log("📋 Criando tarefas...");
    const tasks = await db.insert(schema.tasks).values([
      {
        companyId,
        assignedTo: 3, // Pedro
        title: "Ligar para cliente A",
        description: "Follow-up da proposta enviada",
        status: "todo",
        priority: "high",
        dueDate: new Date("2024-03-20"),
      },
      {
        companyId,
        assignedTo: 4, // Ana
        title: "Revisar código do módulo",
        description: "Code review do PR #123",
        status: "in_progress",
        priority: "medium",
        dueDate: new Date("2024-03-18"),
      },
      {
        companyId,
        assignedTo: 2, // Maria
        title: "Implementar nova feature",
        description: "Adicionar suporte a notificações",
        status: "todo",
        priority: "high",
        dueDate: new Date("2024-03-25"),
      },
    ]);
    console.log(`✅ ${tasks[0]} tarefas criadas`);

    // 7. Criar registros de ponto
    console.log("⏰ Criando registros de ponto...");
    const today = new Date();
    const timeRecords = await db.insert(schema.timeRecords).values([
      {
        companyId,
        employeeId: 1,
        date: today,
        checkIn: new Date(today.getTime() + 8 * 60 * 60 * 1000), // 08:00
        checkOut: new Date(today.getTime() + 17 * 60 * 60 * 1000), // 17:00
        status: "approved",
      },
      {
        companyId,
        employeeId: 2,
        date: today,
        checkIn: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 09:00
        checkOut: new Date(today.getTime() + 18 * 60 * 60 * 1000), // 18:00
        status: "approved",
      },
    ]);
    console.log(`✅ ${timeRecords[0]} registros de ponto criados`);

    console.log("\n✨ Seed concluído com sucesso!");
    console.log(`
📊 Dados criados:
  - 1 Empresa
  - 3 Departamentos
  - 4 Colaboradores
  - 3 Vendas
  - 2 Metas
  - 3 Tarefas
  - 2 Registros de Ponto
    `);
  } catch (error) {
    console.error("❌ Erro durante seed:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();
