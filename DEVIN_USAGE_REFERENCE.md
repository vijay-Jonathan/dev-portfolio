# 🚀 Devin AI Usage Reference

---

## ✅ 1. Do’s & ❌ Don’ts

| Do ✅ | Don’t ❌ |
|-------|----------|
| Break tasks into small, well-scoped tickets (“Add unit tests for function X”) | Give Devin broad/ambiguous tasks (“Make the test suite green” or “Refactor the app”) |
| Use Devin for PR reviews, unit tests, doc edits, and small bugfixes | Use Devin for large-scale refactors, redesigns, or business-critical product logic |
| Provide file paths, inputs/outputs, and clear acceptance criteria | Leave prompts vague (forces Devin to “discover” context, burning ACUs) |
| Upload relevant attachments or repo notes so Devin doesn’t waste cycles searching | Let Devin “guess” environment details (higher ACU cost + higher error rate) |
| Set session & org ACU limits to prevent runaway jobs | Run Devin without ACU caps (risk of surprise bills) |
| Use playbooks and reusable prompts for repeated workflows | Re-explain the same process each time (adds planning overhead) |
| Always add a human review gate before merging Devin’s PRs | Merge Devin’s PRs without review (security & quality risk) |
| Start Devin on non-critical repos (docs, tooling) when onboarding | Throw Devin straight into production-critical repos |

---

## 🧠 2. Best Prompting Formats

| Optimized Prompt (Good) | Inefficient Prompt (Bad) | Why Good Saves ACUs |
|--------------------------|---------------------------|----------------------|
| “Add unit tests for `calculateDiscount()` in `pricing/utils.py`. Cover edge cases (null, negative, >100). Update `tests/test_pricing.py`. Stop after opening PR.” | “Improve test coverage across repo.” | Scoped to 1 function + test file; Devin doesn’t waste time scanning whole repo. |
| “Review PR #42. Focus only on security & missing tests. Do not push commits, only leave comments.” | “Review PR and fix anything wrong.” | Review-only mode = fewer cycles; avoids Devin making changes. |
| “In `docs/`, replace OldProductName with NewProductName. Exclude `/docs/api/`. Commit once.” | “Rename the product everywhere in the repo.” | Excludes unnecessary dirs; avoids scanning code/tests. |
| “Implement `POST /v1/widgets` in `services/widget-service`. Use model `Widget`. Add tests in `tests/test_widget.py`. Keep changes in that service only.” | “Build widget service API.” | Tight file + test scope avoids wasted exploration. |

---

## 💰 3. ACU-Saving Strategies

| Scenario | Naive Approach (High ACU Cost) | Optimized Approach (Low ACU Cost) | Why It Saves ACUs |
|----------|--------------------------------|-----------------------------------|-------------------|
| **Bug Fix** | “Fix the login issue in the app.” → Devin scans entire repo (~8–10 ACUs) | “Fix NullPointerException in `auth/loginService.js` when password=null. Add tests in `tests/test_auth.js`.” (~2–3 ACUs) | Narrow file + bug context prevents repo-wide search. |
| **Test Coverage** | “Increase test coverage.” (~6–8 ACUs) | “Write Jest tests for `utils/dateFormatter.js`. Cover leap years, invalid dates. Stop after PR.” (~2 ACUs) | Scoped to 1 file; avoids test discovery overhead. |
| **PR Review** | “Review PR thoroughly and fix problems.” (~5–6 ACUs) | “Review PR #123. Focus: SQL injection & missing unit tests. Leave comments only.” (~1–2 ACUs) | No code changes + narrow focus → fewer cycles. |
| **Documentation** | “Update docs for API v2.” (~4–5 ACUs) | “In `/docs/endpoints.md`, change `/v1/orders` to `/v2/orders`. Don’t edit code or examples outside that file.” (~1–2 ACUs) | File-specific edit avoids full-doc sweep. |
| **Refactor** | “Refactor user service for clarity.” (~7–10 ACUs) | “Rename function `getUsrInfo` → `getUserInfo` in `userService.py` and update references. Add regression test.” (~3 ACUs) | Explicit rename instruction avoids trial-and-error refactor. |

---

## 🔑 Key ACU Optimization Takeaways

- Every **extra repo scan** = +2–5 ACUs. Always **specify file paths**.  
- Every attempt at “**discovering bugs**” = wasted ACUs. Tell Devin the error upfront.  
- Every **ambiguous prompt** = planning cycles wasted. Use **checklists/bullet prompts**.  
- **Playbooks** reduce ACU by ~30–40% on repeat tasks.  
- “**Review-only**” prompts cost ~70% less ACU than “review + fix” prompts.  

---

## 📋 Onboarding Checklist

- [ ] Create org-level API service key (limit scopes).  
- [ ] Set `max_session_acu_limit` per session/org.  
- [ ] Build playbooks for repeat tasks.  
- [ ] Start with non-critical repos to tune prompts.  
- [ ] Always add human sign-off for Devin PRs.  

---

## 🔧 CI/CD Integration (GitLab + Jenkins)

### GitLab CI (example job)
```yaml
stages:
  - devin-review

devin_pr_review:
  stage: devin-review
  image: curlimages/curl:latest
  only:
    - merge_requests
  variables:
    DEVIN_API_KEY: $DEVIN_API_KEY
  script:
    - |
      RESPONSE=$(curl -s -X POST "https://api.devin.ai/v1/sessions" \
        -H "Authorization: Bearer ${DEVIN_API_KEY}" \
        -H "Content-Type: application/json" \
        -d '{
          "prompt":"Review MR '"$CI_MERGE_REQUEST_IID"' in '"$CI_PROJECT_PATH"'. Focus on security and tests.",
          "idempotent": true
        }')
      echo "Devin response: $RESPONSE"
```
### Jenkins Pipeline (Declarative)
```
pipeline {
  agent any
  stages {
    stage('Devin PR Review') {
      when { expression { return env.CHANGE_ID != null } }
      steps {
        withCredentials([string(credentialsId: 'DEVIN_API_KEY', variable: 'DEVIN_API_KEY')]) {
          sh '''
            RESPONSE=$(curl -s -X POST "https://api.devin.ai/v1/sessions" \
              -H "Authorization: Bearer ${DEVIN_API_KEY}" \
              -H "Content-Type: application/json" \
              -d '{
                "prompt":"Review PR ${CHANGE_ID} in ${JOB_NAME}. Focus on tests and security.",
                "pull_request": {"url":"${CHANGE_URL}"}
              }')
            echo "$RESPONSE"
          '''
        }
      }
    }
  }
}
```
## 🌟 Advanced Strategies for Devin AI (Beyond the Basics)

### 1. Hybrid Human-AI Pairing
- Treat Devin like a **junior engineer**: pair it with senior devs in PRs.  
- Assign Devin scoped issues first, then let a human chain them together.  
- Use Devin for *exploration* (finding fixes, test generation), then humans finalize architecture.  

**Interviewer value-add:** Shows you don’t blindly “trust AI,” but know how to fit it into SDLC.

---

### 2. Observability for AI Usage
- Log every Devin interaction in a **separate audit repo** (prompt, response, ACUs used).  
- Add dashboards (Grafana / Datadog) for **ACU burn rate** and **failure rates**.  
- Correlate Devin’s commits with bug reports → measure **real ROI** of using AI in production.  

**Interviewer value-add:** Brings a DevOps mindset: you measure and monitor AI like any other system.

---

### 3. Secure-by-Design Workflow
- Block Devin from touching secrets/config by scoping access.  
- Run Devin inside a **sandbox branch**; require approval before merging into main.  
- Add a **SonarQube/Snyk stage** right after Devin commits, catching insecure code before it lands.  

**Interviewer value-add:** You understand AI introduces new risks and already plan mitigations.

---

### 4. ACU Budgeting Like Cloud Costs
- Treat ACUs like **cloud credits**:  
  - Tag jobs with `acu_cost` metadata.  
  - Chargeback ACU usage per team/project.  
  - Auto-stop sessions if ROI is negative (e.g., PR rejected repeatedly).  

**Interviewer value-add:** Shows you think in terms of **governance & cost optimization**.

---

### 5. Multi-Agent Playbooks
- Chain Devin with other agents:  
  - **Lint/Format Agent** → **Devin Unit Tests** → **Static Analysis Agent** → **Human Review**.  
- Use lightweight models (like GPT-4-mini) for *triage/exploration*, then call Devin only for execution.  

**Interviewer value-add:** You see Devin as part of an ecosystem, not a single magic tool.

---

### 6. Prompt Engineering Patterns
Instead of raw prompts, use **structured prompt templates**:
```yaml
# Example: Test Creation Playbook
task: "Unit Test Generation"
target_file: "src/utils/dateFormatter.js"
requirements:
  - Cover leap years
  - Cover invalid date strings
  - Ensure null-safe behavior
output:
  - tests/test_dateFormatter.js
stop_after: "PR Created"

