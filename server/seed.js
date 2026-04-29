import prisma from "./config/db.js";
import bcrypt from "bcryptjs";

async function seedDatabase() {
  try {
    console.log("Connected to MongoDB via Prisma");

    // Clear existing data (in correct order to prevent relation errors if we were using foreign keys)
    await prisma.task.deleteMany({});
    await prisma.deal.deleteMany({});
    await prisma.lead.deleteMany({});
    await prisma.user.deleteMany({});
    console.log("Cleared existing data");

    // Create demo users
    const hashedPassword = await bcrypt.hash("demo123456", 10);

    const user1 = await prisma.user.create({
      data: {
        name: "John Smith",
        email: "demo@crm.com",
        password: hashedPassword,
        role: "SALES",
      },
    });

    const user2 = await prisma.user.create({
      data: {
        name: "Sarah Manager",
        email: "manager@crm.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log(`Created users`);

    // Create sample leads
    const leadsData = [
      {
        name: "Acme Corp",
        email: "contact@acme.com",
        phone: "555-0101",
        company: "Acme Corporation",
        source: "Website",
        status: "NEW",
        notes: "Interested in enterprise solution",
        dealValue: 50000,
        nextFollowUp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        assignedTo: user1.id,
      },
      {
        name: "Tech Startup Inc",
        email: "sales@techstartup.com",
        phone: "555-0102",
        company: "Tech Startup Inc",
        source: "Referral",
        status: "CONTACTED",
        notes: "Demo scheduled for next week",
        dealValue: 30000,
        nextFollowUp: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        assignedTo: user1.id,
      },
      {
        name: "Global Industries",
        email: "procurement@global.com",
        phone: "555-0103",
        company: "Global Industries",
        source: "Phone",
        status: "QUALIFIED",
        notes: "Budget approved, waiting for final sign-off",
        dealValue: 75000,
        nextFollowUp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        assignedTo: user1.id,
      },
      {
        name: "Local Services LLC",
        email: "info@localservices.com",
        phone: "555-0104",
        company: "Local Services LLC",
        source: "Social Media",
        status: "PROPOSAL",
        notes: "Proposal sent via email",
        dealValue: 25000,
        nextFollowUp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        assignedTo: user2.id,
      },
      {
        name: "Cloud Solutions Ltd",
        email: "cto@cloudsolutions.com",
        phone: "555-0105",
        company: "Cloud Solutions Ltd",
        source: "Email",
        status: "Closed",
        notes: "Contract signed, implementation starting",
        dealValue: 100000,
        nextFollowUp: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        assignedTo: user2.id,
      },
      {
        name: "Retail Group Co",
        email: "buyer@retailgroup.com",
        phone: "555-0106",
        company: "Retail Group Co",
        source: "Website",
        status: "LOST",
        notes: "Customer chose competitor",
        dealValue: 40000,
        nextFollowUp: null,
        assignedTo: user1.id,
      },
      {
        name: "Finance Plus",
        email: "contact@financeplus.com",
        phone: "555-0107",
        company: "Finance Plus",
        source: "Referral",
        status: "NEW",
        notes: "Initial inquiry about features",
        dealValue: 65000,
        nextFollowUp: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        assignedTo: user1.id,
      },
      {
        name: "Healthcare Network",
        email: "admin@healthcarenet.com",
        phone: "555-0108",
        company: "Healthcare Network",
        source: "Phone",
        status: "CONTACTED",
        notes: "Need to understand compliance requirements",
        dealValue: 120000,
        nextFollowUp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        assignedTo: user2.id,
      },
      {
        name: "Education Institute",
        email: "it@educationinst.com",
        phone: "555-0109",
        company: "Education Institute",
        source: "Email",
        status: "QUALIFIED",
        notes: "Waiting for budget approval from board",
        dealValue: 55000,
        nextFollowUp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        assignedTo: user1.id,
      },
      {
        name: "Manufacturing Corp",
        email: "ops@manufacturingcorp.com",
        phone: "555-0110",
        company: "Manufacturing Corp",
        source: "Website",
        status: "PROPOSAL",
        notes: "Evaluation ongoing",
        dealValue: 85000,
        nextFollowUp: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        assignedTo: user2.id,
      },
    ];

    await prisma.lead.createMany({
      data: leadsData,
    });

    console.log(`Created ${leadsData.length} leads`);

    console.log("✓ Database seeded successfully with Prisma!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
