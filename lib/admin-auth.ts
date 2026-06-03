export interface AdminUser {
    email: string;
    password: string;
    serviceId: number;
    serviceName: string;
}

/**
 * Admin password secret.
 *
 * Passwords are NOT hardcoded. Each admin's password is derived as
 * `${ADMIN_PASSWORD_SECRET}@${serviceKey}` where `serviceKey` is the email
 * prefix before `.admin@vaani.gov.in` (e.g. `aadhaar` -> `<secret>@aadhaar`).
 *
 * This value MUST be provided via the NEXT_PUBLIC_ADMIN_PASSWORD_SECRET
 * environment variable. If it is missing we FAIL CLOSED: no credentials are
 * generated, so every login attempt is rejected. There is intentionally no
 * hardcoded fallback default.
 */
const ADMIN_PASSWORD_SECRET = process.env.NEXT_PUBLIC_ADMIN_PASSWORD_SECRET;

// Service directory: emails are identifiers (not secrets) plus service metadata.
// Passwords are generated at runtime from ADMIN_PASSWORD_SECRET.
interface AdminServiceEntry {
    key: string;
    email: string;
    serviceId: number;
    serviceName: string;
}

const ADMIN_SERVICES: AdminServiceEntry[] = [
    { key: "master", email: "master.admin@vaani.gov.in", serviceId: 0, serviceName: "All Services" },
    { key: "aadhaar", email: "aadhaar.admin@vaani.gov.in", serviceId: 1, serviceName: "Aadhaar Update" },
    { key: "pan", email: "pan.admin@vaani.gov.in", serviceId: 2, serviceName: "PAN Card Application" },
    { key: "voter", email: "voter.admin@vaani.gov.in", serviceId: 3, serviceName: "Voter ID Registration" },
    { key: "birth", email: "birth.admin@vaani.gov.in", serviceId: 4, serviceName: "Birth Certificate" },
    { key: "caste", email: "caste.admin@vaani.gov.in", serviceId: 5, serviceName: "Caste Certificate" },
    { key: "income", email: "income.admin@vaani.gov.in", serviceId: 6, serviceName: "Income Certificate" },
    { key: "passport", email: "passport.admin@vaani.gov.in", serviceId: 7, serviceName: "Passport Application" },
    { key: "driving", email: "driving.admin@vaani.gov.in", serviceId: 8, serviceName: "Driving License" },
    { key: "vehicle", email: "vehicle.admin@vaani.gov.in", serviceId: 9, serviceName: "Vehicle Registration" },
    { key: "hsrp", email: "hsrp.admin@vaani.gov.in", serviceId: 10, serviceName: "High Security HSRP" },
    { key: "railway", email: "railway.admin@vaani.gov.in", serviceId: 11, serviceName: "Railway Senior Citizen" },
    { key: "bank", email: "bank.admin@vaani.gov.in", serviceId: 12, serviceName: "Bank KYC Update" },
    { key: "epf", email: "epf.admin@vaani.gov.in", serviceId: 13, serviceName: "EPF Withdrawal" },
    { key: "itr", email: "itr.admin@vaani.gov.in", serviceId: 14, serviceName: "Income Tax Return" },
    { key: "gst", email: "gst.admin@vaani.gov.in", serviceId: 15, serviceName: "GST Registration" },
    { key: "mudra", email: "mudra.admin@vaani.gov.in", serviceId: 16, serviceName: "Personal Loan Mudra" },
    { key: "oldage", email: "oldage.admin@vaani.gov.in", serviceId: 17, serviceName: "Old Age Pension" },
    { key: "widow", email: "widow.admin@vaani.gov.in", serviceId: 18, serviceName: "Widow Pension" },
    { key: "kisan", email: "kisan.admin@vaani.gov.in", serviceId: 19, serviceName: "Kisan Samman Nidhi" },
    { key: "ration", email: "ration.admin@vaani.gov.in", serviceId: 20, serviceName: "Ration Card Application" },
    { key: "postmatric", email: "postmatric.admin@vaani.gov.in", serviceId: 21, serviceName: "Post-Matric Scholarship" },
    { key: "prematric", email: "prematric.admin@vaani.gov.in", serviceId: 22, serviceName: "Pre-Matric Scholarship" },
    { key: "ayushman", email: "ayushman.admin@vaani.gov.in", serviceId: 23, serviceName: "Ayushman Bharat" },
    { key: "disability", email: "disability.admin@vaani.gov.in", serviceId: 24, serviceName: "Disability Certificate" },
    { key: "mgnrega", email: "mgnrega.admin@vaani.gov.in", serviceId: 25, serviceName: "MGNREGA Job Card" },
    { key: "udyam", email: "udyam.admin@vaani.gov.in", serviceId: 26, serviceName: "Udyam Registration" },
    { key: "fssai", email: "fssai.admin@vaani.gov.in", serviceId: 27, serviceName: "FSSAI License" },
    { key: "pm-awas", email: "pm-awas.admin@vaani.gov.in", serviceId: 28, serviceName: "PM Awas Yojana" },
    { key: "electricity", email: "electricity.admin@vaani.gov.in", serviceId: 29, serviceName: "New Electricity Connection" },
    { key: "water", email: "water.admin@vaani.gov.in", serviceId: 30, serviceName: "Water Pipe Connection" },
    { key: "ujjwala", email: "ujjwala.admin@vaani.gov.in", serviceId: 31, serviceName: "Gas Connection Ujjwala" },
    { key: "soil", email: "soil.admin@vaani.gov.in", serviceId: 32, serviceName: "Soil Health Card" },
    { key: "kcc", email: "kcc.admin@vaani.gov.in", serviceId: 33, serviceName: "Kisan Credit Card" },
    { key: "pesticide", email: "pesticide.admin@vaani.gov.in", serviceId: 34, serviceName: "Pesticide License" },
    { key: "legalheir", email: "legalheir.admin@vaani.gov.in", serviceId: 35, serviceName: "Legal Heir Certificate" },
    { key: "marriage", email: "marriage.admin@vaani.gov.in", serviceId: 36, serviceName: "Marriage Registration" },
    { key: "death", email: "death.admin@vaani.gov.in", serviceId: 37, serviceName: "Death Registration" },
    { key: "dsc", email: "dsc.admin@vaani.gov.in", serviceId: 38, serviceName: "Digital Signature Cert" },
    { key: "domain", email: "domain.admin@vaani.gov.in", serviceId: 39, serviceName: "Domain Registration (.in)" },
    { key: "arms", email: "arms.admin@vaani.gov.in", serviceId: 40, serviceName: "Arms License" },
    { key: "ex-service", email: "ex-service.admin@vaani.gov.in", serviceId: 41, serviceName: "Ex-Servicemen Identity" },
    { key: "senior", email: "senior.admin@vaani.gov.in", serviceId: 42, serviceName: "Senior Citizen Card" },
    { key: "transgender", email: "transgender.admin@vaani.gov.in", serviceId: 43, serviceName: "Transgender ID Card" },
    { key: "sc-st", email: "sc-st.admin@vaani.gov.in", serviceId: 44, serviceName: "SC/ST Fellowship" },
    { key: "minority", email: "minority.admin@vaani.gov.in", serviceId: 45, serviceName: "Minority Scholarship" },
    { key: "bank-open", email: "bank-open.admin@vaani.gov.in", serviceId: 46, serviceName: "Bank Account Opening" },
    { key: "residence", email: "residence.admin@vaani.gov.in", serviceId: 47, serviceName: "Residence Certificate" },
    { key: "health-ins", email: "health-ins.admin@vaani.gov.in", serviceId: 48, serviceName: "Health Insurance Enrollment" },
    { key: "medical-reim", email: "medical-reim.admin@vaani.gov.in", serviceId: 49, serviceName: "Medical Reimbursement" },
    { key: "women-welfare", email: "women-welfare.admin@vaani.gov.in", serviceId: 50, serviceName: "Women Welfare Schemes" },
    { key: "building-worker", email: "building-worker.admin@vaani.gov.in", serviceId: 51, serviceName: "Building Worker Registration" },
    { key: "housing", email: "housing.admin@vaani.gov.in", serviceId: 52, serviceName: "Housing Scheme Application" },
    { key: "fir", email: "fir.admin@vaani.gov.in", serviceId: 53, serviceName: "FIR Registration" },
    { key: "police-verif", email: "police-verif.admin@vaani.gov.in", serviceId: 54, serviceName: "Police Verification" },
    { key: "utility", email: "utility.admin@vaani.gov.in", serviceId: 55, serviceName: "Electricity / Water Connection" },
];

/**
 * Map of admin credentials, keyed by lowercased email.
 *
 * If NEXT_PUBLIC_ADMIN_PASSWORD_SECRET is not set, this map is EMPTY so that
 * authentication fails closed (no login can ever succeed).
 */
export const ADMIN_CREDENTIALS: Record<string, AdminUser> = ADMIN_PASSWORD_SECRET
    ? ADMIN_SERVICES.reduce<Record<string, AdminUser>>((acc, svc) => {
          acc[svc.email] = {
              email: svc.email,
              password: `${ADMIN_PASSWORD_SECRET}@${svc.key}`,
              serviceId: svc.serviceId,
              serviceName: svc.serviceName,
          };
          return acc;
      }, {})
    : {};
