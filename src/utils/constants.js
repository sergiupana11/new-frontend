export const insuranceLevels = {
    "BASIC": 1,
    "MEDIUM": 2,
    "PREMIUM": 3
}

export const checkInsuranceEligibility = (userInsuranceType, carMinimumInsuranceType) => {
    return insuranceLevels[userInsuranceType] >= insuranceLevels[carMinimumInsuranceType]
}

export const ACCEPT_ACTION = 'ACCEPT'
export const DECLINE_ACTION = 'DECLINE'
export const CANCEL_ACTION = 'CANCEL'