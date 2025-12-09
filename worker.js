require('dotenv').config();
const { ZBClient } = require('zeebe-node');

const zbc = new ZBClient();

console.log('✅ Worker connected to Camunda Cloud');

zbc.createWorker({
  taskType: 'automated-evaluation',
  taskHandler: async (job) => {
    console.log('📥 Processing job:', job.key);

    // Scenario A: force auto-approval
    const confidenceScore = 0.2;

    console.log('✅ Calculated confidenceScore:', confidenceScore);

    await job.complete({ confidenceScore });

    console.log('✅ Job completed successfully');
  },
});