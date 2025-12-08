# Camunda Governed Decision Flow

This project demonstrates a **governed decision workflow** implemented on **Camunda 8 (SaaS / Cloud)**, combining **automated evaluation** with a **human-in-the-loop review** when confidence is insufficient.

It showcases a real-world orchestration pattern where decisions are not fully delegated to automation but are escalated to human review based on a confidence threshold.

---

## Architecture Overview

- **Camunda 8 SaaS (Cloud)**
  - Zeebe (Workflow Engine)
  - Operate (Process Monitoring)
  - Tasklist (Human Tasks)
- **Node.js Cloud Worker**
  - Polls Zeebe for jobs
  - Computes a confidence score
  - Completes service tasks programmatically
- **BPMN Model**
  - Exclusive Gateway routes based on confidence

---

## Process Flow

1. **Start Event**
2. **Automated Evaluation (Service Task)**
   - Executed by a Node.js worker
   - Produces a `confidenceScore` (0.0 – 1.0)
3. **Exclusive Gateway – “Confidence sufficient?”**
   - `confidenceScore >= 0.8` → Auto approved
   - `confidenceScore < 0.8` → Human review
4. **Human Review (User Task)**
   - Visible in Camunda Tasklist
5. **End Events**

---

## Gateway Conditions

```expression
confidenceScore >= 0.8