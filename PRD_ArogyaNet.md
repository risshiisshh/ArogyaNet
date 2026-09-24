# Product Requirements Document (PRD)
## ArogyaNet — AI-Powered PHC Resource & Supply Chain Resilience Platform

**Track:** Track 3 — Smart Health & Supply Chain Resilience
**BRICS Theme:** Resilience
**Team:** Rishabh (Lead Dev), Aqsa (Design & Dev), Devesh (Documentation/PPT), Atharva (Feature Additions & Demo Video)
**Date:** September 2026

---

## 1. Problem Statement

Public healthcare systems across developing nations rely on vast, decentralized networks of Primary Health Centres (PHCs). These centres currently operate with little to no real-time visibility into:
- Medicine and consumable stock levels
- Bed availability and occupancy
- Medical staff attendance

This leads to preventable stock-outs, mismatched resource allocation across districts, and slow emergency response when demand spikes (disease outbreaks, seasonal illness, disasters). There is no shared system to detect a shortage before it happens or to intelligently redistribute surplus resources from nearby centres.

## 2. Goal

Build a federated, AI-powered dashboard that gives health administrators real-time, network-wide visibility into PHC resources, predicts stock-outs before they occur, and recommends specific cross-district redistribution actions — with a design that supports future shared predictive modelling across BRICS nations.

## 3. Target Users

- **Primary:** District/state health administrators who oversee multiple PHCs
- **Secondary:** PHC in-charge staff who report/view their own centre's status
- **Tertiary (future scope):** National health ministries coordinating cross-border resource sharing under BRICS cooperation frameworks

## 4. Core Objectives

1. Give administrators a single-screen view of the health of the entire PHC network
2. Surface at-risk centres (low stock, low staffing, high bed occupancy) automatically
3. Forecast stock-outs per medicine per PHC using consumption trends
4. Generate specific, actionable redistribution recommendations using AI reasoning over network-wide data
5. Present all of the above in a clear, non-technical way an administrator can act on in seconds

## 5. Key Features (MVP Scope)

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 1 | Network Dashboard | Grid/map view of all PHCs, color-coded by status (critical/low/healthy) | Must-have |
| 2 | PHC Drill-down | Click into a PHC to see item-level stock, beds, staff attendance | Must-have |
| 3 | AI Early Warnings | Auto-generated plain-language alerts ("X will run out of Y in Z days") | Must-have |
| 4 | AI Redistribution Recommender | Suggests moving specific quantities between specific PHCs, with reasoning | Must-have (this is the standout feature) |
| 5 | Simple Demand Forecast | Rolling-average based projection of stock-out dates | Should-have |
| 6 | Admin Q&A Chat | Ask natural-language questions about network state, get AI answers | Nice-to-have (stretch) |
| 7 | Staff Attendance Anomaly Flag | Flags unusual absenteeism patterns | Nice-to-have (stretch) |

## 6. Out of Scope (for hackathon MVP)

- Real-time IoT/sensor integration with actual PHC systems
- User authentication / role-based access control
- Real cross-border data sharing with other nations (narrative only for this demo)
- Mobile app version
- Payment or procurement transaction execution

## 7. Success Criteria (for the demo)

- Dashboard loads and clearly shows at least 3 distinct PHC statuses (red/yellow/green)
- At least one convincing AI-generated stock-out warning is shown live
- At least one AI-generated redistribution recommendation is shown live, with a one-line reasoning explanation
- End-to-end flow completes in under 90 seconds without errors

## 8. Data Sources

- Seed data drawn from publicly available government health datasets (e.g., data.gov.in, NHM/HMIS, e-Aushadhi) where available
- Extended/supplemented with realistic synthetic data to reach ~15-20 PHC records across 2-3 districts

## 9. BRICS / Governance Narrative

The platform is designed as a **Digital Public Good**: the underlying data schema, forecasting logic, and redistribution algorithm are structured so that any BRICS nation's public health system could adopt the same model, enabling shared predictive modelling and coordinated resource resilience across borders — directly addressing the Track 3 challenge statement.

## 10. Risks

| Risk | Mitigation |
|------|-----------|
| Real government data is messy/incomplete | Clean and supplement with synthetic data early |
| AI recommendations sound generic | Invest time in prompt engineering with real numbers, not placeholders |
| Live demo fails (API timeout, etc.) | Have a recorded backup video (Atharva's demo video) ready as fallback |
| Scope creep | Stick strictly to Must-have features until MVP is fully working end-to-end |
