export const WITHDRAWAL_ENTRY_LABEL = 'Retrageți-vă din contract aici';
export const WITHDRAWAL_CONFIRM_LABEL = 'Confirmă retragerea';

export type WithdrawalInput = {
  submissionId: string;
  name: string;
  orderNumber: string;
  confirmationEmail: string;
  details?: string;
};

export type WithdrawalValidation =
  | { ok: true; value: WithdrawalInput }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateWithdrawalInput(input: unknown): WithdrawalValidation {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, error: 'Datele transmise sunt invalide.' };
  }

  const raw = input as Record<string, unknown>;
  const submissionId = typeof raw.submissionId === 'string' ? raw.submissionId.trim() : '';
  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  const orderNumber = typeof raw.orderNumber === 'string' ? raw.orderNumber.trim() : '';
  const confirmationEmail =
    typeof raw.confirmationEmail === 'string' ? raw.confirmationEmail.trim().toLowerCase() : '';
  const details = typeof raw.details === 'string' ? raw.details.trim() : '';

  if (!UUID_RE.test(submissionId)) return { ok: false, error: 'Identificator invalid.' };
  if (!name || name.length > 150) return { ok: false, error: 'Numele este obligatoriu.' };
  if (!orderNumber || orderNumber.length > 150) {
    return { ok: false, error: 'Identificarea comenzii/contractului este obligatorie.' };
  }
  if (!EMAIL_RE.test(confirmationEmail) || confirmationEmail.length > 254) {
    return { ok: false, error: 'Adresa de email pentru confirmare este invalidă.' };
  }
  if (details.length > 2000) return { ok: false, error: 'Detaliile sunt prea lungi.' };

  return {
    ok: true,
    value: { submissionId, name, orderNumber, confirmationEmail, details: details || undefined },
  };
}

export function buildWithdrawalStatement(data: Pick<WithdrawalInput, 'name' | 'orderNumber'>): string {
  return `Subsemnatul/Subsemnata ${data.name} declar în mod neechivoc că mă retrag din contractul/comanda identificată prin „${data.orderNumber}”.`;
}
