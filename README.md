# Camunda Governed Decision Flow

This project is a **fully working example of a BPMN process executed on Camunda 8 Cloud**, where an automated decision determines whether a case is automatically approved or routed to human review.

The goal is to demonstrate a **typical governed decision pattern**:
- Automation first
- Clear decision rules
- Human intervention only when necessary

---

## 🧭 Overall Architecture

- **Camunda 8 Cloud (SaaS)**
  - BPMN modeled and deployed in Camunda Cloud
  - Process monitoring via Operate
- **Node.js Worker**
  - Implemented locally
  - Connected to the Camunda Cloud cluster via OAuth
  - Executes automated logic and returns variables to the process

---

## 🧩 BPMN Flow

1. **Start**
2. **Automated evaluation** (Service Task)
   - Executed by a Node.js worker
   - Calculates a `confidenceScore`
3. **Exclusive Gateway – "Confidence sufficient?"**
   - If `confidenceScore >= 0.8` → Auto approved
   - If `confidenceScore < 0.8` → Human review
4. **Human review** (User Task)
   - Manual review only when automation is not sufficient

---

## 📸 Real Execution in Camunda Operate

The following screenshot shows a real process instance running in Camunda Cloud, including the `confidenceScore` variable produced by the worker:

![Camunda Operate – Process Instance](docs/operate-screenshot.png)

> Note: the `confidenceScore` variable is returned by the worker and evaluated by the exclusive gateway to determine the process path.

---

## 🧑‍💻 Worker (Node.js)

The worker is implemented using `zeebe-node` and connects to Camunda Cloud through environment variables.

### Core Logic
- Polls jobs of type: `automated-evaluation`
- Generates a confidence score (mock logic)
- Completes the job and sends the variable back to the process

### Simplified Example (`worker.js`)

```js
import { ZBClient } from "zeebe-node";
import "dotenv/config";

const zbc = new ZBClient();
console.log("Worker connected to Camunda Cloud 🚀");

zbc.createWorker({
  taskType: "automated-evaluation",
  taskHandler: async (job) => {
    const confidenceScore = Math.random();
    console.log("Calculated confidenceScore:", confidenceScore);

    await job.complete({ confidenceScore });
    console.log("Job completed ✅");
  }
});
```

---

## ⚙️ Configuration

### Environment Variables (`.env` – NOT versioned)

```env
ZEEBE_CLIENT_ID=your-client-id
ZEEBE_CLIENT_SECRET=your-client-secret
ZEEBE_ADDRESS=cluster-id.region.zeebe.camunda.io:443
ZEEBE_AUTHORIZATION_SERVER_URL=https://login.cloud.camunda.io/oauth/token
```

### Included Example File
An `.env.example` file is included with placeholder values only.

---

## 🚀 Running the Project

1. Install dependencies:
```bash
npm install
```

2. Configure `.env`

3. Start the worker:
```bash
node worker.js
```

4. Deploy the BPMN model using Camunda Desktop Modeler or Web Modeler  
5. Start a process instance and monitor it in **Camunda Operate**

---

## ✅ Project Status

- ✅ BPMN deployed to Camunda Cloud
- ✅ Worker connected and processing jobs
- ✅ Variables visible in Operate
- ✅ Automated + human decision flow working correctly

---

## 🎯 Purpose

This repository serves as:
- A practical **Camunda 8 Cloud** example
- A foundation for governed decision workflows
- A demonstration of BPMN + external worker integration

---

## 🏁 Final Notes

This project **does not rely on local infrastructure** (no Docker, Java, or Elasticsearch).  
Everything runs on **Camunda Cloud SaaS**, following a modern and maintainable approach.

---