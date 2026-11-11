# Data dictionary

Grain: history is one month × provider × workload × service (480 records). scenarios adds Scenario (1,440 records). forecast is future month × workload × scenario (360 records). Months are ISO YYYY-MM text for chronological sorting. All costs are USD, percentages are fractions.

| Field | Definition |
|---|---|
| Month / Provider / Department / CostCenter / Workload / Service / Region | Simulated classification; region labels are not proof of deployed resources |
| UsageQuantity / UsageUnit | Illustrative provider usage; units differ by service and must not be summed |
| Utilization | Synthetic baseline load fraction; headline utilization uses Compute capacity only |
| CapacityUnits / UsedCapacity | Normalized Compute capacity and used capacity; zero for other services |
| WorkloadUnits | Simulated service-output units; populated on Compute once per workload-month |
| OnDemandCost / ActualCost | Direct baseline simulated costs; equal in this on-demand starting case |
| Budget | Independently generated all-in allocated budget, including shared overhead |
| SharedCost | Allocated monthly overhead, fixed across scenarios |
| ReservedEligible / RightsizingOpportunity / Idle / StorageOpportunity | Eligibility flags, not completed actions |
| OptimizedDirectCost / AllocatedCost | Direct scenario spend / direct plus shared cost |
| BaselineAllocatedCost | ActualCost plus SharedCost |
| Savings / IdleSavings / RightsizingSavings / StorageSavings / ReservationSavings | Total sequential direct-cost reduction and action components |
| RemainingCapacity / OptimizedUtilization / CapacityBuffer | Compute capacity after actions; utilized fraction; 1 minus fraction |
| ReservedCostBasis / EligibleCostBasis | Committed eligible cost before discount / eligible post-usage cost |
| ForecastCost / ForecastBudget | Forward monthly scenario cost and budget from December anchor |

Financial formulas: variance = spend − budget; variance % = variance / budget; cost per workload unit = allocated cost / workload units; savings = baseline cost − scenario cost; savings % = savings / baseline cost; run rate = exit-month spend × 12. Zero denominators yield blank DAX ratios (coverage uses zero); website empty filters return zero values.
