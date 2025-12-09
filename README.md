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

---

## 🧪 Phase 5 – Execution Scenarios (Governed Decision Outcomes)

This phase demonstrates **real execution scenarios** of the governed decision process running on **Camunda 8 Cloud**, using the same BPMN model and worker, with different automated outcomes.

The goal is to **prove end-to-end behavior**:
- Automated approval when confidence is high
- Human review when confidence is low
- Clear traceability in Camunda Operate

All executions below are **real process instances**, not mocked or simulated.

---

### ▶️ Scenario A – Automated Approval (High Confidence)

**Description**  
The worker returns a high confidence score (`confidenceScore = 0.95`).  
The exclusive gateway evaluates the condition and routes the process directly to **Auto Approved**, skipping human intervention entirely.

**Key characteristics**
- Confidence score ≥ 0.8
- No user task created
- Process completes automatically

**Observed in Operate**
- Service Task completed successfully
- Gateway taken: `Confidence ≥ 0.8`
- End event: **Auto Approved**
- Variable visible: `confidenceScore = 0.95`

📸 📸 Screenshot: Auto-approved process instance  
`docs/operate-screenshot.png` (same execution shown above)

---

### ▶️ Scenario B – Human Review Required (Low Confidence)

**Description**  
The worker returns a low confidence score (`confidenceScore = 0.2`).  
The process is routed to the **Human Review** user task, requiring a manual decision.

**Key characteristics**
- Confidence score < 0.8
- User task created in Tasklist
- Human decision required before completion

**Observed in Operate**
- Service Task completed successfully
- Gateway taken: `Confidence < 0.8`
- Active User Task: **Human Review**
- Variable visible: `confidenceScore = 0.2`

📸 Screenshot: Human review waiting  
`docs/scenario-human-review.png`

---

### ▶️ Scenario C – Manual Decision Outcome (Human Override)

**Description**  
A user completes the **Human Review** form and explicitly decides the outcome (`approve` or `reject`).  
A second exclusive gateway routes the process based on the human decision.

**Decision logic**
- If decision = `approve` → **Approved by Human**
- If decision = `reject` → **Rejected by Human**

**Observed in Operate**
- User task completed
- Decision variable set by the form
- Gateway evaluates human decision
- Process ends in the correct final state

📸 Screenshot: Human-approved execution  
`docs/scenario-human-approved.png`

---

## ✅ Results Summary

This phase validates that the process:

- ✅ Executes fully automated decisions when allowed  
- ✅ Escalates to manual review only when required  
- ✅ Preserves human authority over final outcomes  
- ✅ Exposes all variables and routing transparently in Operate  

The combination of **BPMN + external worker + Camunda Forms** provides a clean and auditable governed decision flow.

---

## 🧠 Key Takeaway

This project demonstrates a **production-ready governance pattern**:

> **Automate by default, escalate by exception, and always keep the human decision explicit and traceable.**

The process combines **automation, transparency, and human accountability** in a single executable workflow.  
Every decision—automatic or manual—is visible, explainable, and auditable in Camunda Operate.

---

## 🧩 Why This Pattern Matters

In real-world enterprise scenarios, fully automated decisions are often **not enough**. Regulatory, ethical, or business constraints require:

- Human oversight
- Clear decision boundaries
- Auditable outcomes
- Controlled overrides

This implementation shows how Camunda 8 supports these requirements **natively**, without custom frameworks or complex infrastructure.

---

## 🛡 Governance & Auditability

This workflow ensures:

- ✅ Clear separation between automated logic and human judgment  
- ✅ Deterministic routing based on explicit conditions  
- ✅ Full variable visibility in Operate  
- ✅ Reproducible outcomes for audits and reviews  

Every step can be explained post-hoc:
- Why a case was auto-approved  
- Why a case required human intervention  
- Who approved or rejected it  

---

## 🔍 Observability with Camunda Operate

Camunda Operate provides:
- End-to-end execution trace
- Variable inspection at each step
- Visual confirmation of taken paths
- Clear distinction between automated vs manual actions  

This makes the process suitable for:
- Compliance reviews
- Incident analysis
- Governance reporting

---

## 🧱 Design Principles Applied

This project intentionally follows these principles:

- **Explicit decision gates** (no implicit behavior)
- **Single responsibility per task**
- **Stateless workers**
- **Form-driven human input**
- **Versioned BPMN deployments**

These principles make the solution maintainable and extensible.

---

## 🚀 Possible Next Extensions

This baseline can be extended with:

- ✅ DMN decision tables for risk scoring  
- ✅ SLA timers on human review  
- ✅ Role-based task assignment  
- ✅ Decision logging to external systems  
- ✅ Multi-level approval chains  

All without changing the core architecture.

---

## 🏁 Conclusion

This repository is not just a demo—it is a **reference implementation** for governed decision workflows using **Camunda 8 Cloud**.

It proves that you can:
- Automate safely
- Escalate responsibly
- Remain compliant
- And still move fast

---

**End of documentation.**