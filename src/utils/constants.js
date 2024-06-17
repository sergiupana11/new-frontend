export const insuranceLevels = {
    "BASIC": 1,
    "MEDIUM": 2,
    "PREMIUM": 3
}

export const checkInsuranceEligibility = (userInsuranceType, carMinimumInsuranceType) => {
    return insuranceLevels[userInsuranceType] >= insuranceLevels[carMinimumInsuranceType]
}