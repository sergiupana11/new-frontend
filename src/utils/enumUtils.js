export function mapFuelTypeToString(fuelType) {
    switch (fuelType) {
        case 'PETROL': {
            return 'Petrol'
        }
        case 'DIESEL': {
            return 'Diesel'
        }
        case 'LPG': {
            return 'Liquefied petroleum gas'
        }
        case 'PETROL_HYBRID': {
            return 'Hybrid (Petrol + Electric)'
        }
        case 'PETROL_DIESEL': {
            return 'Hybrid (Diesel + Electric)'
        }
        case 'ELECTRIC': {
            return 'Electric'
        }
        default: {
            return 'Other'
        }
    }
}

export function mapStringToFuelType(str) {
    switch (str) {
        case 'Petrol': {
            return 'PETROL'
        }
        case 'Diesel': {
            return 'DIESEL'
        }
        case 'Liquefied petroleum gas': {
            return 'LPG'
        }
        case 'Hybrid (Petrol + Electric)': {
            return 'PETROL_HYBRID'
        }
        case 'Hybrid (Diesel + Electric)': {
            return 'PETROL_DIESEL'
        }
        case 'Electric': {
            return 'ELECTRIC'
        }
        default: {
            return 'OTHER'
        }
    }
}