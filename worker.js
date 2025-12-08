require('dotenv').config();          // Carga el .env
const { ZBClient } = require('zeebe-node');

// El cliente detecta ZEEBE_ADDRESS, ZEEBE_CLIENT_ID y ZEEBE_CLIENT_SECRET desde .env
const zbc = new ZBClient();

console.log('Worker conectado a Camunda Cloud 🚀');

// Worker para la tarea "automated-evaluation"
zbc.createWorker({
  taskType: 'automated-evaluation',
  taskHandler: async (job) => {
    console.log('Procesando job', job.key);

    // Simulamos un score entre 0 y 1
    const confidenceScore = Math.random();
    console.log('Calculated confidenceScore:', confidenceScore);

    // Enviamos la variable al proceso
    await job.complete({
      confidenceScore,
    });

    console.log('Job completado ✅');
  },
});