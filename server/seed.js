import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Lead from "./models/Lead.js";

dotenv.config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log("Cleared existing data");

    // Create demo users
    const hashedPassword = await bcrypt.hash("demo123456", 10);

    const users = await User.create([
      {
        name: "John Smith",
        email: "demo@crm.com",
        password: hashedPassword,
        role: "sales",
        department: "Sales",
      },
      {
        name: "Sarah Manager",
        email: "manager@crm.com",
        password: hashedPassword,
        role: "manager",
        department: "Sales",
      },
      {
        name: "Admin User",
        email: "admin@crm.com",
        password: hashedPassword,
        role: "admin",
        department: "Admin",
      },
    ]);

    console.log(`Created ${users.length} users`);

    // Create sample leads
    const leads = await Lead.create([
      {
        name: "Acme Corp",
        email: "contact@acme.com",
        phone: "555-0101",
        company: "Acme Corporation",
        source: "Website",
        status: "New",
        notes: "Interested in enterprise solution",
        dealValue: 50000,
        nextFollowUp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        assignedTo: users[0]._id,
      },
      {
        name: "Tech Startup Inc",
        email: "sales@techstartup.com",
        phone: "555-0102",
        company: "Tech Startup Inc",
        source: "Referral",
        status: "Contacted",
        notes: "Demo scheduled for next week",
        dealValue: 30000,
        nextFollowUp: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        assignedTo: users[0]._id,
      },
      {
        name: "Global Industries",
        email: "procurement@global.com",
        phone: "555-0103",
        company: "Global Industries",
        source: "Phone",
        status: "Qualified",
        notes: "Budget approved, waiting for final sign-off",
        dealValue: 75000,
        nextFollowUp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        assignedTo: users[0]._id,
      },
      {
        name: "Local Services LLC",
        email: "info@localservices.com",
        phone: "555-0104",
        company: "Local Services LLC",
        source: "Social Media",
        status: "Proposal Sent",
        notes: "Proposal sent via email",
        dealValue: 25000,
        nextFollowUp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        assignedTo: users[1]._id,
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
        assignedTo: users[1]._id,
      },
      {
        name: "Retail Group Co",
        email: "buyer@retailgroup.com",
        phone: "555-0106",
        company: "Retail Group Co",
        source: "Website",
        status: "Lost",
        notes: "Customer chose competitor",
        dealValue: 40000,
        nextFollowUp: null,
        assignedTo: users[0]._id,
      },
      {
        name: "Finance Plus",
        email: "contact@financeplus.com",
        phone: "555-0107",
        company: "Finance Plus",
        source: "Referral",
        status: "New",
        notes: "Initial inquiry about features",
        dealValue: 65000,
        nextFollowUp: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        assignedTo: users[0]._id,
      },
      {
        name: "Healthcare Network",
        email: "admin@healthcarenet.com",
        phone: "555-0108",
        company: "Healthcare Network",
        source: "Phone",
        status: "Contacted",
        notes: "Need to understand compliance requirements",
        dealValue: 120000,
        nextFollowUp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        assignedTo: users[1]._id,
      },
      {
        name: "Education Institute",
        email: "it@educationinst.com",
        phone: "555-0109",
        company: "Education Institute",
        source: "Email",
        status: "Qualified",
        notes: "Waiting for budget approval from board",
        dealValue: 55000,
        nextFollowUp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        assignedTo: users[0]._id,
      },
      {
        name: "Manufacturing Corp",
        email: "ops@manufacturingcorp.com",
        phone: "555-0110",
        company: "Manufacturing Corp",
        source: "Website",
        status: "Proposal Sent",
        notes: "Evaluation ongoing",
        dealValue: 85000,
        nextFollowUp: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        assignedTo: users[1]._id,
      },
    ]);

    console.log(`Created ${leads.length} leads`);

    console.log("✓ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
