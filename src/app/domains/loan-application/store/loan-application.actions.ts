// Optional: Action definitions for more structured state management
// This provides type safety for actions and makes state changes more predictable

import { LoanType } from '../models/loan-type';
import { LoanStatus } from '../models/loan-status';
import { Loan } from '../models/loan';

export enum LoanApplicationActionType {
  // Loading states
  SET_LOADING = '[Loan Application] Set Loading',
  SET_ERROR = '[Loan Application] Set Error',

  // Loan type selection
  SET_LOAN_TYPE = '[Loan Application] Set Loan Type',

  // Form navigation
  SET_FORM_STEP = '[Loan Application] Set Form Step',
  NEXT_STEP = '[Loan Application] Next Step',
  PREVIOUS_STEP = '[Loan Application] Previous Step',

  // Current loan management
  UPDATE_CURRENT_LOAN = '[Loan Application] Update Current Loan',
  RESET_CURRENT_LOAN = '[Loan Application] Reset Current Loan',
  SAVE_DRAFT = '[Loan Application] Save Draft',

  // Loan operations
  LOAD_USER_LOANS = '[Loan Application] Load User Loans',
  LOAD_USER_LOANS_SUCCESS = '[Loan Application] Load User Loans Success',
  LOAD_USER_LOANS_FAILURE = '[Loan Application] Load User Loans Failure',

  SUBMIT_LOAN = '[Loan Application] Submit Loan',
  SUBMIT_LOAN_SUCCESS = '[Loan Application] Submit Loan Success',
  SUBMIT_LOAN_FAILURE = '[Loan Application] Submit Loan Failure',

  // Filtering
  SET_STATUS_FILTER = '[Loan Application] Set Status Filter',
  SET_SEARCH_QUERY = '[Loan Application] Set Search Query',
}

export interface LoanApplicationAction {
  type: LoanApplicationActionType;
  payload?: any;
}

// Action creators
export class LoanApplicationActions {
  static setLoading(isLoading: boolean): LoanApplicationAction {
    return {
      type: LoanApplicationActionType.SET_LOADING,
      payload: isLoading,
    };
  }

  static setError(error: string | null): LoanApplicationAction {
    return {
      type: LoanApplicationActionType.SET_ERROR,
      payload: error,
    };
  }

  static setLoanType(loanType: LoanType): LoanApplicationAction {
    return {
      type: LoanApplicationActionType.SET_LOAN_TYPE,
      payload: loanType,
    };
  }

  static setFormStep(step: number): LoanApplicationAction {
    return {
      type: LoanApplicationActionType.SET_FORM_STEP,
      payload: step,
    };
  }

  static updateCurrentLoan(loanData: Partial<Loan>): LoanApplicationAction {
    return {
      type: LoanApplicationActionType.UPDATE_CURRENT_LOAN,
      payload: loanData,
    };
  }

  static saveDraft(): LoanApplicationAction {
    return {
      type: LoanApplicationActionType.SAVE_DRAFT,
    };
  }

  static submitLoan(): LoanApplicationAction {
    return {
      type: LoanApplicationActionType.SUBMIT_LOAN,
    };
  }

  static loadUserLoans(): LoanApplicationAction {
    return {
      type: LoanApplicationActionType.LOAD_USER_LOANS,
    };
  }

  static setStatusFilter(status: LoanStatus | 'all'): LoanApplicationAction {
    return {
      type: LoanApplicationActionType.SET_STATUS_FILTER,
      payload: status,
    };
  }

  static setSearchQuery(query: string): LoanApplicationAction {
    return {
      type: LoanApplicationActionType.SET_SEARCH_QUERY,
      payload: query,
    };
  }
}
