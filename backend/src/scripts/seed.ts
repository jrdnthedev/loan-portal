import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

interface DbJson {
  loans: any[];
  applicants: any[];
  'loan-types': any[];
  users: any[];
  'audit-logs': any[];
}

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Read db.json
    const dbJsonPath = path.join(__dirname, '../../../db.json');
    const dbJsonContent = fs.readFileSync(dbJsonPath, 'utf-8');
    const dbData: DbJson = JSON.parse(dbJsonContent);

    // Seed Loan Types
    console.log('📝 Seeding loan types...');
    for (const loanType of dbData['loan-types']) {
      await prisma.loanType.upsert({
        where: { id: loanType.id },
        update: {},
        create: {
          id: loanType.id,
          name: loanType.name,
          description: loanType.description,
          minAmount: loanType.minAmount,
          maxAmount: loanType.maxAmount,
          minTerm: loanType.minTerm,
          maxTerm: loanType.maxTerm,
          interestRate: loanType.interestRate,
        },
      });
    }
    console.log(`✅ Created ${dbData['loan-types'].length} loan types`);

    // Seed Users
    console.log('👥 Seeding users...');
    for (const user of dbData.users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          password: hashedPassword,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
        },
      });
    }
    console.log(`✅ Created ${dbData.users.length} users`);

    // Create a map to store old applicant IDs to new applicant IDs
    const applicantIdMap = new Map<string, string>();

    // Seed Applicants (standalone ones first)
    console.log('📋 Seeding applicants...');
    for (const applicant of dbData.applicants) {
      const created = await prisma.applicant.create({
        data: {
          fullName: applicant.fullName,
          dateOfBirth: applicant.dateOfBirth,
          ssn: applicant.ssn,
          income: applicant.income,
          employmentStatus: applicant.employmentStatus,
          creditScore: applicant.creditScore || null,
        },
      });
      applicantIdMap.set(applicant.id, created.id);
    }
    console.log(`✅ Created ${dbData.applicants.length} applicants`);

    // Seed Loans
    console.log('💰 Seeding loans...');
    let loansCreated = 0;
    for (const loan of dbData.loans) {
      try {
        // Create or get applicant
        let applicantId: string;
        if (loan.applicant.id && applicantIdMap.has(loan.applicant.id)) {
          applicantId = applicantIdMap.get(loan.applicant.id)!;
        } else {
          const applicant = await prisma.applicant.create({
            data: {
              fullName: loan.applicant.fullName,
              dateOfBirth: loan.applicant.dateOfBirth,
              ssn: loan.applicant.ssn,
              income: loan.applicant.income,
              employmentStatus: loan.applicant.employmentStatus,
              creditScore: loan.applicant.creditScore || null,
            },
          });
          applicantId = applicant.id;
        }

        // Create co-signer if exists
        let coSignerId: string | undefined;
        if (loan.coSigner) {
          if (loan.coSigner.id && applicantIdMap.has(loan.coSigner.id)) {
            coSignerId = applicantIdMap.get(loan.coSigner.id)!;
          } else {
            const coSigner = await prisma.applicant.create({
              data: {
                fullName: loan.coSigner.fullName,
                dateOfBirth: loan.coSigner.dateOfBirth,
                ssn: loan.coSigner.ssn,
                income: loan.coSigner.income,
                employmentStatus: loan.coSigner.employmentStatus,
                creditScore: loan.coSigner.creditScore || null,
              },
            });
            coSignerId = coSigner.id;
          }
        }

        // Create loan
        await prisma.loan.create({
          data: {
            type: loan.type,
            requestedAmount: loan.amount.requested || loan.amount,
            approvedAmount: loan.amount.approved || null,
            currency: loan.amount.currency || 'USD',
            termMonths: Number(loan.termMonths),
            status: loan.status,
            downPayment: loan.downPayment || null,
            submittedAt: loan.submittedAt ? new Date(loan.submittedAt) : new Date(),
            applicantId,
            coSignerId,
            ...(loan.vehicleInfo && {
              vehicleInfo: {
                create: {
                  make: loan.vehicleInfo.make,
                  model: loan.vehicleInfo.model,
                  year: Number(loan.vehicleInfo.year),
                  vin: loan.vehicleInfo.vin,
                  mileage: Number(loan.vehicleInfo.mileage),
                  value: Number(loan.vehicleInfo.value),
                },
              },
            }),
          },
        });
        loansCreated++;
      } catch (error) {
        console.warn(`⚠️  Skipped loan ${loan.id}:`, error);
      }
    }
    console.log(`✅ Created ${loansCreated} loans`);

    // Seed Audit Logs
    console.log('📊 Seeding audit logs...');
    for (const log of dbData['audit-logs']) {
      await prisma.auditLog.create({
        data: {
          action: log.action,
          timestamp: log.timestamp ? new Date(log.timestamp) : new Date(),
        },
      });
    }
    console.log(`✅ Created ${dbData['audit-logs'].length} audit logs`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
