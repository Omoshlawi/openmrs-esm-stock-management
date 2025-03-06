import { useConfig } from '@openmrs/esm-framework';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { StockOperationType } from '../../core/api/types/stockOperation/StockOperationType';
import { useStockOperationTypes } from '../../stock-lookups/stock-lookups.resource';
import { useStockOperations } from '../stock-operations.resource';
import useParties from './hooks/useParties';
import StockOperationForm from './stock-operation-form.component';
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockReturnValue({ t: (key) => key }),
}));

jest.mock('@openmrs/esm-framework', () => ({
  ActionMenu: jest.fn(() => null),
  showSnackbar: jest.fn(),
  useDebounce: jest.fn((x) => x),
  getGlobalStore: jest.fn(() => ({
    getState: jest.fn(),
    subscribe: jest.fn(),
    setState: jest.fn(),
  })),
  parseDate: jest.fn((date) => new Date(date)),
  showNotification: jest.fn(),
  usePagination: jest.fn(() => ({ currentPage: 1, setPage: jest.fn() })),
  useSession: jest.fn(() => ({ user: { display: 'Test User' } })),
  useConfig: jest.fn(),
  ErrorState: jest.fn(({ error }: { error: any }) => <div>{error}</div>),
  launchWorkspace: jest.fn(),
}));

jest.mock('../../stock-lookups/stock-lookups.resource', () => ({
  useStockOperationTypes: jest.fn(),
  useUsers: jest.fn().mockReturnValue({ items: { results: [] }, isLoading: false }),
  useUser: jest.fn().mockReturnValue({ data: { display: 'Test User' }, isLoading: false, error: null }),
}));

jest.mock('../stock-operations.resource', () => ({
  operationStatusColor: jest.fn(() => 'some-color'),
  getStockOperationLinks: jest.fn(),
  useStockOperations: jest.fn().mockReturnValue({
    items: { results: [] },
    isLoading: false,
    error: null,
  }),
}));

jest.mock('./hooks/useParties', () => jest.fn());

const mockStockOperationType = {
  uuid: '44444444-4444-4444-4444-444444444444',
  dateCreated: new Date('2022-07-31T00:00:00.000+0300'),
  dateChanged: null,
  name: 'Receipt',
  description: 'Items that are added into the inventory system from an outside provider.',
  operationType: 'receipt',
  hasSource: true,
  sourceType: 'Other',
  hasDestination: true,
  destinationType: 'Location',
  availableWhenReserved: false,
  allowExpiredBatchNumbers: false,
  stockOperationTypeLocationScopes: [],
};

describe('Receipt Stock Operation step 1 (baseoperation details)', () => {
  beforeEach(() => {
    const mockStockOperationTypes = { results: [] };
    (useStockOperationTypes as jest.Mock).mockReturnValue(mockStockOperationTypes);
    (useStockOperations as jest.Mock).mockReturnValue({ items: { results: [] }, isLoading: false, error: null });
    (useConfig as jest.Mock).mockReturnValue({ autoPopulateResponsiblePerson: true });
  });

  it('should render loading state when loading  parties info', async () => {
    (useParties as jest.Mock).mockReturnValue({
      destinationParties: [],
      sourceParties: [],
      isLoading: true,
      error: null,
      sourceTags: [],
      destinationTags: [],
    });
    render(<StockOperationForm stockOperationType={mockStockOperationType as StockOperationType} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render error state when parties loading fails', async () => {
    (useParties as jest.Mock).mockReturnValue({
      destinationParties: [],
      sourceParties: [],
      isLoading: false,
      error: 'error',
      sourceTags: [],
      destinationTags: [],
    });
    render(<StockOperationForm stockOperationType={mockStockOperationType as StockOperationType} />);
    expect(screen.getByText('error')).toBeInTheDocument();
  });

  it('should have only next btn and not previous btn', async () => {
    (useParties as jest.Mock).mockReturnValue({
      destinationParties: [],
      sourceParties: [],
      isLoading: false,
      error: undefined,
      sourceTags: [],
      destinationTags: [],
    });
    render(<StockOperationForm stockOperationType={mockStockOperationType as StockOperationType} />);
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument();
  });
  it('should render operation type in title', async () => {
    (useParties as jest.Mock).mockReturnValue({
      destinationParties: [],
      sourceParties: [],
      isLoading: false,
      error: undefined,
      sourceTags: [],
      destinationTags: [],
    });
    render(<StockOperationForm stockOperationType={mockStockOperationType as StockOperationType} />);
    expect(screen.getByText(`${mockStockOperationType.name} details`)).toBeInTheDocument();
  });

  it("should render combobox with 'from' name and 'chooseAsource' placeholder", async () => {
    (useParties as jest.Mock).mockReturnValue({
      destinationParties: [],
      sourceParties: [],
      isLoading: false,
      error: undefined,
      sourceTags: [],
      destinationTags: [],
    });
    render(<StockOperationForm stockOperationType={mockStockOperationType as StockOperationType} />);
    const sourceInput = screen.getByRole('combobox', {
      name: (_, element) =>
        element.getAttribute('placeholder') === 'chooseASource' && element.getAttribute('name') === 'sourceUuid',
    });
    expect(sourceInput).toBeInTheDocument();
    expect(screen.getByLabelText('from')).toBeInTheDocument();
  });
  it("should render combobox with 'destinationUuid' name and 'chooseADestination' placeholder", async () => {
    (useParties as jest.Mock).mockReturnValue({
      destinationParties: [],
      sourceParties: [],
      isLoading: false,
      error: undefined,
      sourceTags: [],
      destinationTags: [],
    });
    render(<StockOperationForm stockOperationType={mockStockOperationType as StockOperationType} />);
    expect(
      screen.getByRole('combobox', {
        name: (_, element) =>
          element.getAttribute('placeholder') === 'chooseADestination' &&
          element.getAttribute('name') === 'destinationUuid',
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('to')).toBeInTheDocument();
  });

  it('should not render reason input field', async () => {
    (useParties as jest.Mock).mockReturnValue({
      destinationParties: [],
      sourceParties: [],
      isLoading: false,
      error: undefined,
      sourceTags: [],
      destinationTags: [],
    });
    render(<StockOperationForm stockOperationType={mockStockOperationType as StockOperationType} />);
    expect(screen.queryByLabelText(/.*reason.*/i)).not.toBeInTheDocument();
  });

  // TODO Test for the form initialization for filed like responsible person
});
