import { CircleDash } from '@carbon/react/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseDate, useConfig, useSession } from '@openmrs/esm-framework';
import React, { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StockOperationDTO } from '../../core/api/types/stockOperation/StockOperationDTO';
import { operationFromString, StockOperationType } from '../../core/api/types/stockOperation/StockOperationType';
import { TabItem } from '../../core/components/tabs/types';
import { getStockOperationFormSchema, StockOperationItemDtoSchema } from '../validation-schema';
import BaseOperationDetailsFormStep from './steps/base-operation-details-form-step';
import StockOperationStepper from './stock-operation-stepper/stock-operation-stepper.component';
import { ConfigObject } from '../../config-schema';
import { today } from '../../constants';
import StockOperationItemsFormStep from './steps/stock-operation-items-form-step.component';

/**
 * Props interface for the StockOperationForm component
 * @interface StockOperationFormProps
 * @property {StockOperationType} [stockOperationType] - The stock operation type being created or edited.
 * @property {StockOperationDTO} [stockOperation] - The stock operation data transfer object.
 * When undefined or null, the form will be in creation mode.
 */
type StockOperationFormProps = {
  stockOperation?: StockOperationDTO;
  stockOperationType: StockOperationType;
};

const StockOperationForm: React.FC<StockOperationFormProps> = ({ stockOperation, stockOperationType }) => {
  const { t } = useTranslation();
  const operationType = useMemo(() => {
    return operationFromString(stockOperationType.operationType);
  }, [stockOperationType]);
  const formschema = useMemo(() => {
    return getStockOperationFormSchema(operationType);
  }, [operationType]);
  const steps: TabItem[] = useMemo(() => {
    return [
      {
        name: stockOperation ? `${stockOperationType?.name} Details` : `${stockOperationType?.name} Details`,
        component: (
          <BaseOperationDetailsFormStep stockOperation={stockOperation} stockOperationType={stockOperationType} />
        ),
      },
      {
        name: t('stockItems', 'Stock Items'),
        component: (
          <StockOperationItemsFormStep stockOperation={stockOperation} stockOperationType={stockOperationType} />
        ),
      },
    ] as TabItem[];
  }, [stockOperation, stockOperationType, t]);
  const {
    user: { uuid: defaultLoggedUserUuid },
  } = useSession();
  const { autoPopulateResponsiblePerson } = useConfig<ConfigObject>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  // TODO Default values not picking well, find and fix
  const form = useForm<StockOperationItemDtoSchema>({
    // defaultValues: operationType === OperationType.STOCK_ISSUE_OPERATION_TYPE ? issueStockOperation : model,
    defaultValues: {
      responsiblePersonUuid:
        stockOperation?.responsiblePersonUuid ?? (autoPopulateResponsiblePerson ? defaultLoggedUserUuid : undefined),
      operationDate: stockOperation?.operationDate ? parseDate(stockOperation!.operationDate as any) : today(),
      remarks: stockOperation?.remarks ?? '',
      sourceUuid: stockOperation?.sourceUuid ?? '',
      destinationUuid: stockOperation?.destinationUuid ?? '',
      operationTypeUuid: stockOperation?.operationTypeUuid ?? stockOperationType?.uuid,
      reasonUuid: stockOperation?.reasonUuid ?? '',
      responsiblePersonOther: stockOperation?.responsiblePersonOther ?? '',
      stockOperationItems: stockOperation?.stockOperationItems ?? [],
    },
    mode: 'all',
    resolver: zodResolver(formschema),
  });
  return (
    <FormProvider {...form}>
      <StockOperationStepper
        steps={steps.map((tab, index) => ({
          title: tab.name,
          component: tab.component,
          disabled: tab.disabled,
          subTitle: `Subtitle  for ${tab.name}`,
          icon: <CircleDash />,
        }))}
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
      />
    </FormProvider>
  );
};

export default StockOperationForm;
