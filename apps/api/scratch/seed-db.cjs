const admin = require('firebase-admin');
const path = require('path');

// Try to find the service account key
// In a real environment, this would be an env var or a file
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS 
  ? require(path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS))
  : null;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault(),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
  });
}

const db = admin.database();

const canadaPipeline = {
  electionId: 'federal_2025',
  currentStageId: 'pre_election',
  stages: {
    'pre_election': {
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2025-09-01'
    },
    'registration': {
      status: 'upcoming',
      startDate: '2025-09-02',
      endDate: '2025-10-15'
    },
    'voting': {
      status: 'upcoming',
      startDate: '2025-10-20',
      endDate: '2025-10-20'
    }
  }
};

async function seed() {
  try {
    await db.ref('pipelines/CA/federal_2025').set(canadaPipeline);
    console.log('Successfully seeded Canada pipeline');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
