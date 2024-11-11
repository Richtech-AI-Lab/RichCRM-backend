// Cast Int to Enum
const castIntToEnum = (enuTable, value) => {
    
    var keys = Object.keys(enuTable).sort(function(a, b){
        return enuTable[a] - enuTable[b];
    }); //sorting is required since the order of keys is not guaranteed.
    
    var getEnum = function(value) {
        return keys[value];
    }

    return getEnum(value);
}

module.exports = {
    // [UTILS]
    castIntToEnum: castIntToEnum,

    // [DB] USER
    userRole: {
        ADMIN: 0,
        ATTORNEY: 1,
        CLIENT: 2,
    },

    // [DB] CASE
    stage: {
        SETUP: 0,
        CONTRACT_PREPARING: 1,
        CONTRACT_SIGNING: 2,
        MORTGAGE: 3,
        CLOSING: 4,
    },

    caseType: {
        PURCHASING: 0,
        SELLING: 1,
    },

    // [DB] PREMISES
    propertyType: {
        HOUSE_SINGLE: 0,
        HOUSE_MULTI: 1,
        CONDO: 2,
        COMMERCIAL: 3,
        LAND: 4,
        CO_OP: 5,
        CONDO_OP: 6,
    },
    
    maintenanceFeePer: {
        MONTH: 0,
        QUARTER: 1,
        YEAR: 2,
    },

    // [DB] CLIENT
    title: {
        NA: 0,
        MR: 1,
        MRS: 2,
        MS: 3,
        DR: 4,
    },

    gender: {
        NA: 0,
        MALE: 1,
        FEMALE: 2,
    },

    clientType: {
        INDIVIDUAL: 0,
        COMPANY: 1,
        TRUST: 2,
    },

    // [DB] STAGE
    stageDefaultTaskList: {
        SETUP: [
            {
                taskType: 0,
                name: "Case set up",
                status: 0,
            },
            {
                taskType: 2,
                name: "Inspection report",
                status: 0,
            },
            {
                taskType: 1,
                name: "Confirm case details",
                status: 0,
                templates: [
                    {templateTitle: "[IMPORTANT] FEK Notice to Purchaser"},
                    {templateTitle: "Default Template"},
                ]
            },
        ],
        CONTRACT_PREPARING: [
            {
                taskType: 2,
                name: "Initial contract",
                status: 0,
            },
            {
                taskType: 1,
                name: "Schedule contract review with client",
                status: 0,
                templates: [
                    {templateTitle: "Default Template"},
                ]
            },
            {
                taskType: 0,
                name: "Contract review",
                status: 0,
            },
            {
                taskType: 1,
                name: "Collect signed contract and deposit from client",
                status: 0,
                templates: [
                    {templateTitle: "Default Template"},
                ]
            },
            {
                taskType: 2,
                name: "Initial signed contract",
                status: 0,
            },
            {
                taskType: 2,
                name: "Deposit",
                status: 0,
            },
        ],
        CONTRACT_SIGNING: [
            {
                taskType: 0,
                name: "Confirm wire info with seller",
                status: 0,
            },
            {
                taskType: 0,
                name: "Send the deposit",
                status: 0,
            },
            {
                taskType: 1,
                name: "Inform the seller about the sending, and request the fully signed contract",
                status: 0,
                templates: [
                    {templateTitle: "[IMPORTANT] FEK Notice to Purchaser's Attorney as Seller"},
                ]
            },
            {
                taskType: 2,
                name: "Fully signed contract",
                status: 0,
            },
        ],
        MORTGAGE: [
            // Mortgage tasks
            {
                taskType: 0,
                name: "Set up mortgage due date",
                status: 0,
            },
            {
                taskType: 1,
                name: "Inform the client about the upcoming timeline",
                status: 0,
                templates: [
                    {templateTitle: "[IMPORTANT] FEK Notice to Purchaser"},
                ]
            },
            {
                taskType: 2,
                name: "Commitment letter",
                status: 0,
            },
            {
                taskType: 1,
                name: "Send the commitment to title company and seller",
                status: 0,
                templates: [
                    {templateTitle: "[IMPORTANT] FEK Notice to Purchaser's Attorney as Seller"},
                ]
            },
            {
                taskType: 2,
                name: "Bank CTC",
                status: 0,
            },
            // Title tasks
            {
                taskType: 0,
                name: "Order title",
                status: 0,
            },
            {
                taskType: 2,
                name: "Title report",
                status: 0,
            },
            {
                taskType: 1,
                name: "Confirm the title with client",
                status: 0,
                templates: [
                    {templateTitle: "Default Template"},
                ]
            },
            {
                taskType: 2,
                name: "All cleared title",
                status: 0,
            },
        ],
        CLOSING: [
            {
                taskType: 0,
                name: "Schedule closing date",
                status: 0,
            },
            {
                taskType: 1,
                name: "Inform closing information to everyone engaged",
                status: 0,
                templates: [
                    {templateTitle: "[IMPORTANT] Closing Confirmation send to all parties"},
                ]
            },
            {
                taskType: 1,
                name: "Calculate the checks needed and inform the client",
                status: 0,
                templates: [
                    {templateTitle: "[IMPORTANT] Proposed Contract of Sale and Rider for Review and Signature"},
                ]
            },
            {
                taskType: 0,
                name: "Closing event",
                status: 0,
            },
            {
                taskType: 2,
                name: "All closing files",
                status: 0,
            },
            {
                taskType: 1,
                name: "Collect feedbacks from the client",
                status: 0,
                templates: [
                    {templateTitle: "Default Template"},
                ]
            },
        ]
    },
    

    // [DB] TASK
    taskType: {
        ACTION: 0,
        CONTACT: 1,
        UPLOAD: 2,
    },

    status: {
        NOT_STARTED: 0,
        PENDING: 1,
        FINISHED: 2,
        OVERDUE: 3,
    },

    // [DB] CONTACT
    contactType: {
        BROKER: 0,
        ATTORNEY: 1,
        TITLE: 2,
        LENDER: 3,
        CLIENT: 4,
        OTHER: 5,
    },

    // [DB] ORGANIZATION
    organizationType: {
        OTHER: 0,
        COMPANY: 1,
        TRUST: 2,
    },

    // [DB] TAG
    tagType: {
        OTHER: 0,
        CONTACT: 1,
    }
};